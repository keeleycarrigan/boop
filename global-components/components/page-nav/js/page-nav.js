'use strict';

(function (momappoki = {}, $, window) {
  momappoki.components = momappoki.components || {};

  /**
   * THIS IS NO WHERE NEAR COMPLETE. THIS WAS MOSTLY JUST TO RUN THE NEW COMPONENTS
   * TOGETHER TO MAKE SURE THEY WORK ON THE CURRENT STICKY NAVS THAT WE HAVE
   */
   const $BODY = $('body');
   const COMPONENT = 'momappoki_pagenav';
   const DATA_ATTRIBUTE = 'data-page-nav';
   const OPTIONS_ATTRIBUTE = 'data-page-nav-opts';
   const DEFAULTS = {
     context: null,
     delegate: '[data-scroll-to]',
     backToTop: $('.back-to-top')
   };

  momappoki.components.PageNav = class PageNav {
    constructor ($el, options = {}) {
      if (!(this instanceof PageNav)) { return new PageNav(($el, options)); }

      let inst = $.data($el[0], COMPONENT);

      if (!inst) {
        inst = $.data($el[0], COMPONENT, this);

        this.init($el, options);
      }

      return inst;
    }

    init ($el, options) {
      this.$el = $el;

      const dataOpts = JSON.parse(this.$el.attr(OPTIONS_ATTRIBUTE) || '{}');
      this.options = $.extend(true, {}, DEFAULTS, options, dataOpts);
      this.options.context = this.options.context || this.$el;

      this.$el.attr(DATA_ATTRIBUTE, 'initialized');

      this.$el.on('click.scrollTo', this.options.delegate, this.handleNavClick.bind(this));

      this.options.backToTop.on('click', (e) => {
        e.preventDefault();
        $('body, html').animate({ scrollTop: 0 });
      });
    }

    handleNavClick (e) {
      e.preventDefault();

      $BODY.trigger('momappoki.linkScroll.scrollTo', $(e.currentTarget).attr('href'));
    }
  }

  window.momappoki = momappoki;
})(window.momappoki, jQuery, window);
