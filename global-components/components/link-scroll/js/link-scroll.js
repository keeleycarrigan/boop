((momappoki = {}, $, _, window) => {
  momappoki.page = momappoki.page || {};
  momappoki.components = momappoki.components || {};

  const LOG = _.get(momappoki, 'utilities.logMessage', $.noop);
  const QUERY_PARAMS = _.get(momappoki, 'utilities.getQueryParams', $.noop);
  const COMPONENT = 'momappoki_linkScroll';
  const $BODY = $('body');
  const $BODYHTML = $('body, html');
  const DATA_ATTRIBUTE = 'data-link-scroll';
  const OPTIONS_ATTRIBUTE = 'data-link-scroll-options';
  const DEFAULTS = {
    // context passed in so only elements inside the context will be listened to
    // context: $BODY,

    // duration for the scroll animation
    duration: 400,

    // whether or not to use the built in listener
    // set to false if you want to call 'momappoki.linkScroll.scrollTo' only manually
    setupContextListener: true,

    // how far from the top of the section the page scrolls.
    // more positive stops higher on the page
    offset: 30,

    // pass in what to listen for
    delegate: '[data-scroll-to]',

    // the value the data attribute will equal
    dataAttributeValue: ''
  };
  let instances = [];

  class LinkScroll {
    constructor ($el = $BODY, options = {}) {
      if (!(this instanceof LinkScroll)) { return new LinkScroll($el, options); }

      if (!$el || !($el instanceof jQuery)) {
        LOG('link-scroll.js:%cClass instances must be initialized with a jQuery element', 'color:red');
        return;
      }

      let inst = $.data($el[0], COMPONENT);

      if (!inst) {
        inst = $.data($el[0], COMPONENT, this);
        instances = [...instances, this];

        this.init($el, options);
      }

      return inst;
    }

    static getInstance ($el) {
      if (!$el || !($el instanceof jQuery)) {
        return null;
      }

      return $.data($el[0], COMPONENT);
    }

    init ($el, options) {
      this.$el = $el;

      // if no context return
      if (!this.$el.length) { return; }

      const dataOpts = this.$el.attr(OPTIONS_ATTRIBUTE) || '{}';

      this.options = $.extend(true, {}, DEFAULTS, options, JSON.parse(dataOpts));
      this.animation = null;
      this.$el.attr(DATA_ATTRIBUTE, 'initialized');
      momappoki.page.isScrolling = false;

      this.$el
        .on('click.linkScroll', this.options.delegate, this.handleLinkClick.bind(this))
        .on('momappoki.linkScroll.scrollTo', this.handleScrollToEvent.bind(this));

      this.listeners = ['click.linkScroll', 'momappoki.linkScroll.scrollTo'];

      this.checkHash();
    }

    handleLinkClick (e) {
      e.preventDefault();

      const $clicked = $(e.currentTarget);

      this.$el.trigger('momappoki.linkScroll.scrollTo', [$clicked.attr('href'), $clicked]);
    }

    handleScrollToEvent (e, id, $clicked) {
      const sectionID = typeof (e) === 'string' ? e : id;
      const $link = $clicked || $(`[href="${sectionID}"]`);

      this.scrollToSection(sectionID, $link);
    }

    checkHash () {
      const param = QUERY_PARAMS('linkTo');

      if (param && param.trim() !== '') {
        const hash = param.substr(0, 1) !== '#' ? `#${param}` : param;
        const $link = this.$el.find(`[href="${hash}"]`);
        const $panel = $(hash);
        if ($link.length > 0 && $panel.is(':visible')) {
          /**
            This is really lame, but it adds a little extra padding to scroll
            to the proper place especially on pages with content loaded by ajax.
            Phoenix pages work fine without it. Old pages need it and are using
            this file now. :(
          **/
          window.onload = () => {
            this.scrollToSection(hash, $link);
          };
        }
      }
    }

    scrollToSection (sectionID, $link) {
      if (!sectionID || typeof (sectionID) !== 'string') { return; }

      $link = $link || this.$el.find(`[href="${sectionID}"]`);
      // if link-scroll-to or href is used without the hash, it will be added here
      const hash = sectionID.substr(0, 1) !== '#' ? `#${sectionID}` : sectionID;
      const $section = $(sectionID);
      const name = $link.attr('data-track-name') || '';
      // if there is a specific offset on the section we are scrolling to
      // use that instead of the default
      const offsetToUse = $section.attr('data-scroll-offset') ? parseInt($section.attr('data-scroll-offset'), 10) : this.options.offset;
      let moveToPosition = 0;

      if ($section.length) {
        const sectionOffset = $section.offset().top;

        if (sectionOffset - offsetToUse > 0) {
          moveToPosition = sectionOffset - offsetToUse;
        }

        momappoki.page.isScrolling = true;

        $BODY.trigger('momappoki.linkScroll.scrollStart', { hash, name });

        this.animation = $BODYHTML.animate({
          scrollTop: moveToPosition
        }, {
          duration: this.options.duration
        }).promise();
        this.animation.done(() => {
          momappoki.page.isScrolling = false;
          $BODY.trigger('momappoki.linkScroll.scrollComplete');
        });

        $section.find('[data-scroll-focus]').focus();
      } else {
        LOG('link-scroll.js:%cSection does not exist.', 'color:red');
      }
    }

    destroy () {
      this.listeners.forEach(listener => this.$el.off(listener));
    }
  }

  momappoki.components.LinkScroll = LinkScroll;
})(window.momappoki, jQuery, _, window, document);
