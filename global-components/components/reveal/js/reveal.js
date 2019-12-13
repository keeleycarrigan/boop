((momappoki = {}, $, _) => {
  momappoki.components = momappoki.components || {};

  const LOG = _.get(momappoki, 'utilities.logMessage', $.noop);

  const COMPONENT = 'momappoki-reveal';
  const DATA_OPTS = 'reveal-opts';
  const ID_DATA = 'data-reveal-id';
  const WINDOW_DATA = 'data-reveal-window';
  const CONTENT_DATA = 'data-reveal-content';
  const MAIN_TRIGGER_DATA = 'data-reveal-main-trigger';
  const TRIGGER_DATA = 'data-reveal-trigger';
  const EVENT_NAMESPACE = 'reveal';
  let instances = [];
  let envInitialized = false;

  function onTriggerClick (e) {
    e.preventDefault();

    const $clicked = $(e.currentTarget);
    const revealID = $clicked.attr(MAIN_TRIGGER_DATA) || $clicked.attr(TRIGGER_DATA);

    if (revealID) {
      const reveals = instances.filter(inst => inst.id === revealID);

      if (reveals.length) {
        reveals.forEach((reveal, idx) => {
          /**
            This is to account for an element being initialized, removed, and a
            similiar one being added later. Yes, this happens :(
          **/
          if (reveal.$el.length) {
            reveal.activate(revealID);
          } else {
            instances = instances.filter((inst, instIdx) => instIdx !== idx);
          }
        });
      } else {
        LOG('reveal.js:%cReveal ID doesn\'t exist', 'color:red');
      }
    }
  }

  function initEnv () {
    envInitialized = true;

    $('body').on(`click.${EVENT_NAMESPACE}`, `[${MAIN_TRIGGER_DATA}], [${TRIGGER_DATA}]`, onTriggerClick);
  }

  const DEFAULTS = {
    onInit: $.noop
  };

  class Reveal {
    constructor ($el, options = {}) {
      if (!(this instanceof Reveal)) { return new Reveal($el, options); }

      let inst = null;

      if ($el && $el instanceof jQuery && $el.length) {
        inst = $.data($el[0], COMPONENT);

        !envInitialized && initEnv();

        if (!inst) {
          inst = $.data($el[0], COMPONENT, this);
          instances = [...instances, this];

          this.init($el, options);
        }
      }

      return inst;
    }

    static getInstance ($el) {
      let inst = null;

      if ($el && $el instanceof jQuery && $el.length) {
        inst = $.data($el[0], COMPONENT);
      }

      return inst;
    }

    init ($el, options) {
      this.$el = $el;
      this.id = this.$el.attr(ID_DATA);
      this.$mainTrigger = $(`[${MAIN_TRIGGER_DATA}="${this.id}"]`);
      this.$window = $(`[${WINDOW_DATA}="${this.id}"]`);
      this.$content = $(`[${CONTENT_DATA}="${this.id}"]`).attr('aria-hidden', true);

      this.fullHeight = this.$content.outerHeight();
      this.active = false;

      const dataOpts = this.$el.data(DATA_OPTS) || {};

      this.options = $.extend(true, {}, DEFAULTS, options, dataOpts);

      this.options.onInit(this);
    }

    activate () {
      this.$content.attr('aria-hidden', false);
      this.$window.css('max-height', this.fullHeight);
      this.$mainTrigger.addClass('off');
      this.active = true;

      this.focusContent();
    }

    focusContent () {
      const $dataFocus = this.$content.find('data-first-focus');
      const $firstContent = this.$content.find(':visible').not('div, ul, article, section, header, text').eq(0);
      const $firstFocus = $dataFocus.length ? $dataFocus : $firstContent;

      if (!$firstFocus.is(':focusable')) {
        $firstFocus.attr('tabindex', '-1');
      }

      $firstFocus.focus();
    }
  }

  momappoki.components.Reveal = Reveal;
  window.momappoki = momappoki;
})(window.momappoki, window.jQuery, _);
