'use strict';

const momappoki = momappoki || {};
momappoki.components = momappoki.components || {};


/**
 * TODOS:
 * Change name of component
 * Ability to stack sticky components
 * Ability to stick components anywhere on the page
 * Ability to pass in options in the data-attribute on the html element
 * Make data-attribute private
 * Add deep extend
 */

momappoki.components.StickyElement = (function () {
  const $BODY = $('body');
  const DATA_ATTRIBUTE = 'data-sticky-element';
  const OPTIONS_ATTRIBUTE = 'data-sticky-element-options';
  const defaultOptions = {
    // jquery element to stick
    element: null,

    // additional amount to add before sticking
    // array of breakpoints/offsets
    // [ [breakpoint, offset], [breakpoint, offset] ]
    // positive offset will stick before the page scrolls to the top of it
    // negative offset will stick after the page scrolls to the top of it
    // default will stack and calculate offset with anything already stuck before
    // if null, offset will be automatically calculated to stack
    offsets: [[0, null]],

    // offsets for multiple elements
    // for example, $('.sticky-nav') may be more than one element, so you would pass in
    // the multiple elementOffsets like below, specified by a class name
    // momappoki.components.stickyComponent({
    //   element: $('.sticky-nav'),
    //   elementOffsets: {
    //     'jump-nav': [ [0, 0], [768, 41], [1000, 60] ],
    //     'info-bar': [ [0, 0], [768, 5] ]
    //   }
    // });
    elementOffsets: {},

    // use a placeholder to keep page from jumping
    // when sticking element
    usePlaceholder: true,

    // position to stick the component
    // can also use bottom to stack on the bottom
    position: 'top',

    // data attribute to add to element
    dataAttribute: 'data-momappoki-sticky-component',

    // the value the data attribute will equal
    dataAttributeValue: ''
  };

  // private helper method to break apart multiple elements with multiple offsets
  function getOffset ($elem, opts) {
    const classArray = $elem.attr('class').split(' ');

    if (!classArray.length || !opts.elementOffsets) { return 0; }

    for (let i = 0, len = classArray.length; i < len; i++) {
      if (opts.elementOffsets[classArray[i]]) { return opts.elementOffsets[classArray[i]]; }
    }

    return defaultOptions.offset;
  }

  // self contained way of only creating one window scroll event
  function createScrollEventSafely () {
    const currentEvents = $._data($(window)[0], 'events');
    let hasScroll = false;

    function triggerScrollEvent () { $('body').trigger('momappoki.scrollEvent'); }

    if (!currentEvents.scroll || !currentEvents.scroll.length) {
      return $(window).on('scroll', triggerScrollEvent);
    }

    $.each(currentEvents.scroll, (ind, evt) => {
      if (evt.handler.toString() === triggerScrollEvent.toString()) {
        hasScroll = true;
      }
    });

    return hasScroll ? false : $(window).on('scroll', triggerScrollEvent);
  }

  function StickyElement (overrideOptions) {
    const self = this;
    if (!(self instanceof StickyElement)) { return new StickyElement(overrideOptions); }

    // this is so you can just pass in a jquery element rather than an object...
    if (overrideOptions && overrideOptions instanceof jQuery) {
      const cont = overrideOptions;
      overrideOptions = { element: cont };
    }

    self.options = {};
    self.overrideOptions = overrideOptions;
    self.stuckPosition = 0;
    self.isStuck = false;
    self.updateTimer = null;
    self.componentPosition = 0;
    self.currentStickOffset = 0;
    self.placeholder = null;
    // this is default
    self.elementTagName = 'div';
    self.stickyEventNamespace = 'momappoki.sticky.change';
    self.totalOffset = 0;
    self.isUpdating = false;

    // this data attribute is always used
    self.componentDataAttribute = '';

    $(() => {
      self.init();
    });
  }

  StickyElement.prototype = {
    init () {
      const self = this;
      let attr;
      self.setOptions();
      self.componentDataAttribute = `data-momappoki-sticky-${self.options.position}`;
      attr = self.options.element.attr(DATA_ATTRIBUTE);

      // if no element return
      if (!this.options.element || !this.options.element.length) { return; }

      // if has data attribute and it equals initialized, return
      if (typeof attr !== 'undefined' && attr === 'initialized') { return; }

      // if there are multiple, set them all up
      if (self.options.element.length > 1) {
        self.options.element.each((ind, element) => {
          const $elem = $(element);
          const offsets = getOffset($elem, self.options);

          new StickyElement({ element: $elem, offsets });
        });
        return;
      }

      self.options.element.attr(DATA_ATTRIBUTE, 'initialized');
      self.options.element.attr(self.componentDataAttribute, '');
      self.elementTagName = self.options.element.prop('tagName').toLowerCase();

      self.updateAll();
      $BODY.trigger('momappoki.sticky.add');

      self.setupListeners();
    },

    setOptions () {
      const element = this.overrideOptions && this.overrideOptions.element ? this.overrideOptions.element : defaultOptions.element;
      let opts = element.attr(OPTIONS_ATTRIBUTE) || '{}';
      opts = JSON.parse(opts);
      this.options = $.extend(true, {}, defaultOptions, this.overrideOptions, opts);
    },

    setupListeners () {
      const self = this;

      // keep from setting up many on scroll events to be managed
      createScrollEventSafely();

      $(window).on('resize', () => {
        clearTimeout(self.updateTimer);
        self.updateTimer = setTimeout($.proxy(self.updateAll, self), 500);
      });

      $BODY.on('momappoki.scrollEvent', $.proxy(self.scrollEvent, self));

      $BODY.on('momappoki.sticky.add', $.proxy(self.updateAll, self));
    },

    updateAll () {
      this.isUpdating = true;
      this.findCurrentNavOffset();
      this.updateStickyOffset();
      this.updatePlaceholder();
      this.setupElementListeners();
      this.updateTotalOffset();
      this.scrollEvent();
    },

    /**
     * add a placeholder for when the component becomes sticky
     */
    addPlaceholder: function () {
      if (!this.options.usePlaceholder) {
        return;
      }

      this.placeholder = $(`<${this.elementTagName} />`, {
        'class': 'placeholder'
      });
      this.placeholder.css({
        margin: 0,
        padding: 0
      });

      this.placeholder.hide();
      this.options.element.after(this.placeholder);
    },

    /**
     * update the placeholder size if the screen size changes
     */
    updatePlaceholder () {
      if (!this.options.usePlaceholder) { return; }

      if (!this.placeholder) {
        this.addPlaceholder();
      }

      this.placeholder.height(this.options.element.outerHeight(true));
    },

    /**
     * This finds the offsets passed in for different screen sizes to adjust when
     * the component sticks
     * @return {[type]} [description]
     */
    findCurrentNavOffset () {
      const screenWidth = parseInt($(document).width(), 10);
      const offsetArray = this.options.offsets;
      let plusOne;
      let current;

      // if no offsets, set to 0
      if (offsetArray.length < 1) {
        this.currentStickOffset = null;
        return;
      }

      // if only a single offset set to that offset
      if (offsetArray.length === 1) {
        if (screenWidth >= offsetArray[0][0]) {
          this.currentStickOffset = offsetArray[0][1] || null;
        } else {
          this.currentStickOffset = null;
        }
        return;
      }

      // sort the offsets based on screen size
      const sortedOffsets = offsetArray.sort((a, b) => {
        return a[0] - b[0];
      });

      // find the correct offset
      for (let i = 0, len = sortedOffsets.length - 1; i < len; i++) {
        current = parseInt(sortedOffsets[i][0], 10);
        plusOne = parseInt(sortedOffsets[i + 1][0], 10);

        if (screenWidth > current && screenWidth < plusOne) {
          this.currentStickOffset = sortedOffsets[i][1] || 0;
          return;
        }
      }
      this.currentStickOffset = sortedOffsets[sortedOffsets.length - 1][1] || 0;
    },

    /**
     * find the current position of the component and figure out
     * when to stick and unstick the component
     * @return {[type]} [description]
     */
    updateStickyOffset () {
      if (this.options.element.is(':hidden')) {
        this.unstickElement()
      }
      // has to have class clear to clear anything floated before it
      const $temp = $(`<${this.elementTagName} />`, { 'class': this.options.element.attr('class') });

      $temp.insertBefore(this.options.element);
      $temp.removeClass('active').addClass('inactive');

      // offset is to make up for stuff already stuck so we want it to stick sooner
      this.stuckPosition = $temp.offset().top;
      $temp.remove();
      this.componentPosition = this.options.element.offset().top;
    },

    getCurrentStuck () {
      const currentStickies = $(`[${this.componentDataAttribute}]`);
      let totalOffset = 0;
      let i;

      if (!currentStickies.length) { return 0; }

      if (this.options.position === 'top') {
        i = 0;
        for (let len = currentStickies.length; i < len; i++) {
          if (this.options.element[0] === currentStickies[i]) {
            break;
          }
          if ($(currentStickies[i]).attr(this.componentDataAttribute) === 'active' && $(currentStickies[i]).is(':visible')) {
            totalOffset += parseInt($(currentStickies[i]).outerHeight(), 10);
          }
        }
      } else {
        for (i = currentStickies.length - 1; i >= 0; i-- ) {
          if (this.options.element[0] === currentStickies[i]) {
            break;
          }
          if ($(currentStickies[i]).attr(this.componentDataAttribute) === 'active' && $(currentStickies[i]).is(':visible')) {
            totalOffset += parseInt($(currentStickies[i]).outerHeight(), 10);
          }
        }
      }

      return totalOffset;
    },

    setupElementListeners () {
      const self = this;
      const currentStickies = $(`[${this.componentDataAttribute}]`);
      const thisElementIndex = currentStickies.index(this.options.element);

      if (!currentStickies.length || currentStickies.length === 1) {
        return 0;
      }

      currentStickies.each((index, sticky) => {
        // we are going to remove the event first so we don't end up stacking events
        // and calling them multiple times......
        if ((self.options.position === 'top' && index < thisElementIndex) || (self.options.position === 'bottom' && index > thisElementIndex)) {
          $(sticky).off(self.stickyEventNamespace, $.proxy(self.updateTotalOffset, self));
          $(sticky).on(self.stickyEventNamespace, $.proxy(self.updateTotalOffset, self));
        }
      });
      return {};
    },

    updateTotalOffset () {
      const self = this;
      if (self.currentStickOffset !== null) {
        self.totalOffset = self.currentStickOffset;
      } else {
        self.totalOffset = self.getCurrentStuck();
      }
    },

    getCurrentScrollPosition () {
      return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    },

    stickElement (amount) {
      const elem = this.options.element;

      this.isStuck = true;
      this.updatePlaceholder();
      elem.attr(this.componentDataAttribute, 'active');
      elem.addClass('active').removeClass('inactive');
      elem.css('position', 'fixed');
      elem.css(this.options.position, `${amount}px`);
      elem.trigger(this.stickyEventNamespace, true);
      if (this.options.usePlaceholder) {
        this.placeholder.show();
      }
    },

    unstickElement () {
      const elem = this.options.element;
      this.isStuck = false;

      elem.removeClass('active').addClass('inactive');
      elem.attr(this.componentDataAttribute, '');
      elem.css({
        'position': 'relative',
        'top': '',
        'bottom': ''
      });

      elem.trigger(this.stickyEventNamespace, false);
      if (this.options.usePlaceholder && this.placeholder) {
        this.placeholder.hide();
      }
    },

    bottomStickScroll (scrollPosition, currentStuckOffset, stuckPosition) {
      if (scrollPosition <= stuckPosition && (this.isUpdating || this.isStuck === false)) {
        this.stickElement(currentStuckOffset);
      }

      if (scrollPosition > stuckPosition && (this.isUpdating || this.isStuck === true)) {
        this.unstickElement();
      }
      this.isUpdating = false;
    },

    topStickScroll (scrollPosition, currentStuckOffset, stuckPosition) {
      if (scrollPosition >= stuckPosition && (this.isUpdating || this.isStuck === false)) {
        this.stickElement(currentStuckOffset);
      }

      if (scrollPosition < stuckPosition && (this.isUpdating || this.isStuck === true)) {
        this.unstickElement();
      }
      this.isUpdating = false;
    },

    scrollEvent () {
      let scrollPosition = this.getCurrentScrollPosition();
      const currentStuckOffset = this.totalOffset;
      const elem = this.options.element;
      let stuckPosition;

      // this.updateTotalOffset();

      if (!elem.is(':visible') || elem.css('visibility') === 'hidden') { return; }

      if (elem.offset().top !== this.componentPosition) {
        this.updateStickyOffset();
      }

      if (!elem.is('.initialized')) {
        elem.addClass('initialized');
      }

      if (this.options.position === 'top') {
        stuckPosition = this.stuckPosition - currentStuckOffset;

        return this.topStickScroll(scrollPosition, currentStuckOffset, stuckPosition);
      }

      scrollPosition += $(window).height();
      stuckPosition = (this.stuckPosition + elem.outerHeight()) + currentStuckOffset;

      return this.bottomStickScroll(scrollPosition, currentStuckOffset, stuckPosition);
    },

    destroy () {}
  };
  return StickyElement;
})();
