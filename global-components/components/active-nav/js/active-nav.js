((momappoki, $, window, document) => {
  'use strict';

  momappoki.components = momappoki.components || {};
  Number.parseInt = Number.parseInt || parseInt;

  const LOG = _.get(momappoki, 'utilities.logMessage', $.noop);

  momappoki.components.ActiveNav = (() => {
    var DATA_ATTRIBUTE = 'data-active-nav',
        OPTIONS_ATTRIBUTE = 'data-active-nav-options',
        SCROLL_OFFSET_ATTRIBUTE = 'data-active-offset',
        $BODY = $('body'),
        defaultOptions = {
          // jquery component that has the active menu
          context: null,

          // element to change active title
          activeTitleElement: $(".section-title"),

          // could use '[data-active-section]'
          elementString: 'a[href^="#"]',

          // offset above position to show active
          offset: 60
        };

    // self contained way of only creating one window scroll event
    function createScrollEventSafely() {
      var currentEvents = $._data($(window)[0], 'events'),
          hasScroll = false;

      function triggerScrollEvent() { $('body').trigger('momappoki.scrollEvent'); }

      if (!currentEvents.scroll || !currentEvents.scroll.length) {
        return $(window).on('scroll', triggerScrollEvent);
      }

      $.each(currentEvents.scroll, function(ind, evt) {
        if (evt.handler.toString() === triggerScrollEvent.toString()) {
          hasScroll = true;
        }
      });

      return hasScroll ? false : $(window).on('scroll', triggerScrollEvent);
    }

    function ActiveNav (overrideOptions) {
      var self = this;
      if (!(self instanceof ActiveNav)) { return new ActiveNav(overrideOptions); }

      // this is so you can just pass in a jquery element rather than an object...
      if (overrideOptions && overrideOptions instanceof jQuery) {
        var cont = overrideOptions;
        overrideOptions = { context: cont };
      }

      self.options = {};
      self.overrideOptions = overrideOptions;
      self.pageOffsets = {};
      self.pageOffsetSortedKeys = [];
      self.sectionHashes = [];
      self.navLinks = [];
      self.sectionOffsets = [];
      self.activeHash = null;
      self.activeIndex = 0;
      self.usingDataAttr = false;
      self.scrollTimeout = null;
      self.useScrollTimeout = false;
      self.hashChangeTimer = null;
      self.isInitialized = false;

      $(function() {
        self.init();
      });
    }

    ActiveNav.prototype = {
      init: function () {
        var attr;
        this.setOptions();
        // if no context return
        if (!this.options.context || !this.options.context.length) { return; }

        attr = this.options.context.attr(DATA_ATTRIBUTE);
        // if has data attribute and it equals initialized, return
        if (typeof attr !== 'undefined' && attr === 'initialized') { return; }

        this.options.context.attr(DATA_ATTRIBUTE, 'initialized');
        this.navLinks = this.options.context.find(this.options.elementString);

        setTimeout(() => {
          this.setSortedHashList();
          this.setSectionOffsets();
          this.setupListeners();
          this.scrollStop();
          this.scrollEvent();
        }, 10);
      },

      setOptions: function () {
        var context = this.overrideOptions && this.overrideOptions.context ? this.overrideOptions.context : defaultOptions.context,
            opts;
        if (!context) { return; }
        opts = context.attr(OPTIONS_ATTRIBUTE) || "{}";
        opts = JSON.parse(opts);
        this.options = $.extend(true, {}, defaultOptions, this.overrideOptions, opts);
      },

      setupListeners: function () {
        var self = this;
        createScrollEventSafely();

        // on link
        $BODY.on('momappoki.linkScroll.scrollTo', function() {
          self.useScrollTimeout = true;
        });

        $BODY.on('momappoki.scrollEvent', $.proxy(self.scrollEvent, self));

        $(window).on("resize", function () {
          clearTimeout(self.updateTimer);
          self.updateTimer = setTimeout(function () {
            self.setSectionOffsets();
            self.scrollEvent();
          }, 500);
        });
      },

      /**
       * loop through the context to find all of the section hashes for the page
       */
      findSectionHashes: function () {
        var self = this, elemHash;
        self.navLinks.each(function(ind, elem) {
          if ($(elem).attr('data-active-section')) {
            self.usingDataAttr = true;
            elemHash = $(elem).attr('data-active-section');
          } else {
            self.usingDataAttr = false;
            elemHash = $(elem).attr('href');
          }
          if (elemHash && elemHash !== '#' && $(elemHash).length) {
            self.sectionHashes.push(elemHash);
          }
        });
      },

      /**
       * this gets an array of specific offsets
       */
      setSectionOffsets: function() {
        var self = this,
            infoBarBuffer = 0,
            elem;
        self.sectionOffsets = [];

        if ($('.info-bar').length) {
          // Adding 10 here at the moment to make up for the border that appears on the info bar when it sticks
          infoBarBuffer = 10;
        }

        self.sectionHashes.forEach(function(current, i) {
          elem = document.getElementById(current.slice(1));
          if (elem && elem.hasAttribute(SCROLL_OFFSET_ATTRIBUTE) && $(current).attr(SCROLL_OFFSET_ATTRIBUTE)) {
            // add one so link scroll using the same scroll offset
            // will trigger the active nav
            self.sectionOffsets[i] = Number.parseInt($(current).attr(SCROLL_OFFSET_ATTRIBUTE),10) + infoBarBuffer;
          } else {
            self.sectionOffsets[i] = null;
          }
        });
      },

      /**
       * sort the hashlist in order from top to bottom
       * in case they are not in the same order as the nav
       * for some reason
       */
      setSortedHashList: function() {
        var self = this;

        self.findSectionHashes();

        self.sectionHashes.sort(function(a, b){
          return $(a).offset().top - $(b).offset().top;
        });
      },

      getIndividualIndex: function (index) {
        // Add 1 so the link is activated when linked to scroll (in link-scroll)
        return parseInt(this.sectionOffsets[index] !== null ? this.sectionOffsets[index] : this.options.offset, 10) + 1;
      },

      /**
       * find the new active hash
       * @param  {number} sP Scroll Top Position
       * @return {string}    The new hash string
       */
      findNewActive: function (sP) {
        var hashes = this.sectionHashes,
            currentIndex = hashes.indexOf(this.activeHash),
            current, plusOne;
        // currentIndex = currentIndex < 0 ? -1 : currentIndex;

        // first
        if (sP < $(hashes[0]).offset().top - this.getIndividualIndex(0)) {
          return '#nothing';
        }

        // last
        if (sP >= $(hashes[hashes.length - 1]).offset().top - this.getIndividualIndex(hashes.length - 1)) {
          return hashes[hashes.length - 1];
        }


        if (currentIndex > -1) {
          // same position
          if (sP >= $(hashes[currentIndex]).offset().top - this.getIndividualIndex(currentIndex) &&
              sP < $(hashes[currentIndex + 1]).offset().top - this.getIndividualIndex(currentIndex + 1)) {
              return this.activeHash;
          }
        }

        for (var i = 0, len = hashes.length - 1; i < len; i++) {
          current = $(hashes[i]).offset().top - this.getIndividualIndex(i);
          plusOne = $(hashes[i + 1]).offset().top - this.getIndividualIndex(i + 1);

          if (sP >= current && sP < plusOne) {
            return hashes[i];
          }
        }
      },

      scrollStop: function () {
        var activeName;
        var self = this;
        $BODY.on('momappoki.activeNav.activeSection', function (e, argObject) {
          // Fancy Postal event for your usage pleasure
          postal.channel('momappoki.activeNav').publish({
            topic: 'activeSection',
            data: argObject
          });

          var activeSection = argObject.activeHash;

          // if the context is not the same context as the one firing the event
          // we are going to not run the rest of the logic.
          if (!argObject.triggerContext.is(self.options.context) || self.options.context.is(':hidden')) {
            return;
          }

          if (!self.isInitialized && activeSection === '#top') {
            self.isInitialized = true;
            return;
          }

          self.isInitialized = true;

          if (self.hashChangeTimer) {
            clearTimeout(self.hashChangeTimer);
            self.hashChangeTimer = null;
          }

          self.hashChangeTimer = setTimeout(function() {
            activeName = self.options.context.find(`a[href="${activeSection}"]`).attr('data-track-name') || '';
            $BODY.trigger('momappoki.activeNav.activeStop', {hash: activeSection, name: activeName});
            LOG('%cactive-nav.js hash stop', 'color:blue', activeSection);
          }, 1500);
        });

      },

      /**
       * Scroll event that is fired on scroll to see which hash is active
       */
      scrollEvent: function () {
        var self = this,
            scrollPosition = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop,
            newActive = self.findNewActive(scrollPosition),
            stringSearch, $activeLink;

        if (newActive === self.activeHash) { return; }

        self.activeHash = newActive;

        stringSearch = self.usingDataAttr ? '[data-active-section="' + self.activeHash + '"]' : '[href="' + self.activeHash + '"]';
        $activeLink = self.options.context.find(stringSearch);
        self.options.context.find(self.options.elementString).removeClass('active');

        $activeLink.addClass('active');

        $BODY.trigger('momappoki.activeNav.activeSection', { activeHash: self.activeHash, triggerContext: self.options.context });

        LOG('%cactive-nav.js hash change', 'color:blue', self.activeHash);

        // this is to keep it from changing the text many times on click scroll
        // using this as a back up in case it doesn't change on click
        // change the active title element

        if (self.options.activeTitleElement.length && self.options.context.is(':visible') && $activeLink.prop('tagName') !== 'BUTTON') {

          if (self.useScrollTimeout) {
            clearTimeout(self.scrollTimeout);
            self.scrollTimeout = setTimeout(function() {
              self.options.activeTitleElement.text($activeLink.text());
              self.useScrollTimeout = false;
            }, 100);

          } else {
            self.options.activeTitleElement.text($activeLink.text());
          }
        }
      },

      destroy: function () {

      }
    };

    return ActiveNav;
  })();

  window.momappoki = momappoki;
})(window.momappoki || {}, $, window, document);
