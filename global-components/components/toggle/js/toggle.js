 ((momappoki = {}, $, _) => {
  momappoki.components = momappoki.components || {};

  const LOG = _.get(momappoki, 'utilities.logMessage', $.noop);
  const $BODY = $('body');
  const COMPONENT = 'momappoki-toggle';
  const CLICK_TRIGGER_DATA = 'data-click-toggle-trigger';
  const HOVER_TRIGGER_DATA = 'data-hover-toggle-trigger';
  const SCROLL_TRIGGER_DATA = 'data-scroll-toggle-trigger';
  const TARGET_DATA = 'data-toggle-id';
  const TARGET_FOCUS_DATA = 'data-toggle-target-focus';
  const EVENT_NAMESPACE = 'toggle';
  const RAF_CALLBACKS = [];
  // Can refactor out below when we have a global utility.
  const IS_TOUCH = (() => (('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch || navigator.maxTouchPoints > 0) === true))();
  const CLICK_ACTION = (() => (IS_TOUCH && !navigator.pointerEnabled ? `touchstart.${EVENT_NAMESPACE}` : `click.${EVENT_NAMESPACE}`))();
  const HOVER_ACTION = (() => (IS_TOUCH && !navigator.pointerEnabled ? `touchstart.${EVENT_NAMESPACE}` : `mouseover.${EVENT_NAMESPACE} mouseout.${EVENT_NAMESPACE}`))();
  const rafFallback = callback => window.setTimeout(callback, 1000 / 60);
  const reqAnimFrame = window.requestAnimationFrame || rafFallback;
  let scrollLoopInitialized = false;
  let lastScrollTop = window.pageYOffset;
  let instances = [];


  function callToggles (filter, method, ...callbackArgs) {
    const toggles = instances.filter(filter);

    toggles.forEach((toggle, idx) => {
      if (toggle.$el.length) {
        if (typeof (method) === 'function') {
          method(toggle, ...callbackArgs);
        } else {
          toggle[method] && toggle[method](...callbackArgs);
        }
      } else {
        // Remove instance because the element is gone.
        instances = instances.filter((inst, instIdx) => instIdx !== idx);
      }
    });
  }

  function checkScrollToggles (scrollTop) {
    const scrollCallbacks = [...RAF_CALLBACKS];

    while (scrollCallbacks.length) {
      scrollCallbacks.shift().call(null, scrollTop);
    }
  }

  function createScrollTrigger ($trigger, toggleInst) {
    const scrollOffset = $trigger.data('scroll-toggle-offset') || 0;
    const toggleEdge = $trigger.data('scroll-toggle-edge') || 'top';

    return (scrollTop) => {
      const triggerTop = $trigger.offset().top;
      const triggerBottom = triggerTop + $trigger.outerHeight();
      const pageScroll = scrollTop + parseInt(scrollOffset, 10);

      toggleInst && toggleInst._handleScrollToggle($trigger, pageScroll, toggleEdge === 'top' ? triggerTop : triggerBottom);
    };
  }

  function scrollLoop () {
    scrollLoopInitialized = true;
    const scrollTop = window.pageYOffset;

    if (lastScrollTop !== scrollTop) {
      lastScrollTop = scrollTop;

      checkScrollToggles(scrollTop);
    }

    reqAnimFrame(scrollLoop);
  }

  function handleToggle (e) {
    e.preventDefault();
    console.log(e.type)
    const $trigger = $(e.currentTarget);
    const toggleID = $trigger.attr(e.data.triggerType);

    callToggles(inst => _.get(inst, 'id') === toggleID, 'toggle', $trigger);
  }

  function handleKeydown (e) {
    const {
      isSpace,
      isEnter
    } = momappoki.utilities.convertKeyCode(e);

    if (isSpace || isEnter) {
      e.preventDefault();
      const $trigger = $(e.currentTarget);
      const toggleID = $trigger.attr(CLICK_TRIGGER_DATA) || $trigger.attr(HOVER_TRIGGER_DATA);
      const toggle = _.find(instances, inst => _.get(inst, 'id') === toggleID);

      toggle && toggle._keydownToggle($trigger);
    }
  }

  (function initEnv () {
    const clickSelector = `[${CLICK_TRIGGER_DATA}]`;
    const hoverSelector = `[${HOVER_TRIGGER_DATA}]`;
    const scrollSelector = `[${SCROLL_TRIGGER_DATA}]`;
    const clickTriggersActive = $(clickSelector).length;
    const hoverTriggersActive = $(hoverSelector).length;
    const scrollTriggersActive = $(scrollSelector).length;

    clickTriggersActive && $BODY.on(CLICK_ACTION, clickSelector, { triggerType: CLICK_TRIGGER_DATA }, handleToggle);
    hoverTriggersActive && $BODY.on(HOVER_ACTION, hoverSelector, { triggerType: HOVER_TRIGGER_DATA }, handleToggle);
    scrollTriggersActive && scrollLoop();

    if (clickTriggersActive || hoverTriggersActive) {
      $BODY.on(`keydown.${EVENT_NAMESPACE}`, `${clickSelector}, ${hoverSelector}`, handleKeydown);
    }
  })();

  /**
    Format for target/trigger attributes to toggle.

    {
      name: 'some-attribute',
      active: 'active-value',
      inactive: 'inactive-value'
    },
    {
      name: 'aria-expanded',
      active: true,
      inactive: false
    }
  **/

  const DEFAULTS = {
    animate: false,
    animation: $el => $el.slideToggle(),
    animationDuration: 400,
    canCloseAll: false,
    dismissable: false,
    groupID: null,
    inactiveClass: 'inactive',
    spotlight: false,
    targetToggleAttrs: [],
    targetToggleClass: 'active',
    targetRemoveClass: false,
    triggerToggleAttrs: [],
    triggerToggleClass: 'active',
    triggerRemoveClass: false,
    targetScrollToggle: false,
    thereCanOnlyBeOne: true,
    onInit: $.noop,
    onActive: $.noop,
    onInactive: $.noop,
    onToggle: $.noop,
    onKeydown: $.noop
  };

  class Toggle {
    constructor ($el, options = {}) {
      // $el should be toggle target.
      if (!(this instanceof Toggle)) { return new Toggle($el, options); }

      let inst = null;

      if ($el && $el instanceof jQuery && $el.length) {
        inst = $.data($el[0], COMPONENT);

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

      const dataOpts = this.$el.data('toggle-opts') || {};

      this.options = $.extend(true, {}, DEFAULTS, options, dataOpts);

      this.options.onInit(this);

      this.active = this.$el.hasClass(this.options.targetToggleClass) && !this.options.targetRemoveClass;
      this.id = this.$el.attr(TARGET_DATA);
      this.$firstFocus = this.$el.is(':visible') ? this._getFirstFocus() : null;
      this.allTriggerSelector = `[${CLICK_TRIGGER_DATA}="${this.id}"], [${HOVER_TRIGGER_DATA}="${this.id}"], [${SCROLL_TRIGGER_DATA}="${this.id}"]`;
      this.$allTriggers = $(this.allTriggerSelector);
      this.$lastTrigger = this.active ? this.$allTriggers.eq(0) : null;

      if (this.options.targetToggleAttrs.length) {
        this.targetAttrs = this._createAttrs(this.options.targetToggleAttrs);
      }
      if (this.options.triggerToggleAttrs.length) {
        this.triggerAttrs = this._createAttrs(this.options.triggerToggleAttrs);
      }

      $(`[${SCROLL_TRIGGER_DATA}="${this.id}"]`).each((idx, el) => {
        RAF_CALLBACKS.push(createScrollTrigger($(el), this));
      });

      if (this.options.targetScrollToggle) {
        !scrollLoopInitialized && scrollLoop();
        RAF_CALLBACKS.push(createScrollTrigger(this.$el, this));
      }
    }

    _createAttrs (attrs = []) {
      return {
        active: attrs.reduce((obj, attr) => {
          obj[attr.name] = attr.active;

          return obj;
        }, {}),
        inactive: attrs.reduce((obj, attr) => {
          obj[attr.name] = attr.inactive;

          return obj;
        }, {})
      }
    }

    _theQuickening (groupID, makeActive) {
      const thisID = this.id;
      function callback (inst) {
        const activeCompare = makeActive ? inst.id === thisID : false;

        inst && inst._internalToggle($(`[${CLICK_TRIGGER_DATA}="${inst.id}"], [${HOVER_TRIGGER_DATA}="${inst.id}"], [${SCROLL_TRIGGER_DATA}="${inst.id}"]`), activeCompare, false);
      }

      function filter (inst) {
        return _.get(inst, 'options.groupID') === groupID;
      }

      callToggles(filter, callback);
    }

    _shineSpotlight (groupID, active) {
      const thisID = this.id;
      function filter (inst) {
        return _.get(inst, 'options.groupID') === groupID;
      }
      function spotlightOn (inst) {
        inst && inst._internalToggle($(`[${CLICK_TRIGGER_DATA}="${inst.id}"], [${HOVER_TRIGGER_DATA}="${inst.id}"], [${SCROLL_TRIGGER_DATA}="${inst.id}"]`), inst.id === thisID, inst.id !== thisID);
      }
      function spotlightOff (inst) {
        inst && inst._internalToggle($(`[${CLICK_TRIGGER_DATA}="${inst.id}"], [${HOVER_TRIGGER_DATA}="${inst.id}"], [${SCROLL_TRIGGER_DATA}="${inst.id}"]`), false, false);
      }

      callToggles(filter, active ? spotlightOn : spotlightOff);
    }

    _getFirstFocus () {
      const $targetFocus = this.$el.is(`[${TARGET_FOCUS_DATA}]`) ? this.$el : this.$el.find(`[${TARGET_FOCUS_DATA}]`);
      const $focusable = this.$el.children(':visible').length ? this.$el.find(':visible').not('div, ul, article, section').eq(0) : this.$el;
      const $firstFocus = $targetFocus.length ? $targetFocus : $focusable;

      if (!$firstFocus.is(':focusable')) {
        $firstFocus.attr('tabindex', '-1');
      }

      return $firstFocus;
    }

    _handleScrollToggle ($trigger, pageScroll, triggerEdge) {
      if (pageScroll >= triggerEdge && !this.active) {
        this.toggle($trigger);
      } else if (pageScroll <= triggerEdge && this.active) {
        this.toggle($trigger);
      }
    }

    _keydownToggle ($trigger) {
      const {
        animate,
        animationDuration
      } = this.options;

      this.toggle($trigger);
      this.options.onKeydown(this, $trigger);

      setTimeout(() => {
        if (!this.$firstFocus && this.$el.is(':visible')) {
          this.$firstFocus = this._getFirstFocus();
        }
        if (this.active) {
          this.$firstFocus.focus();
        }
      }, animate ? animationDuration : 0);
    }

    _handleDismiss (e) {
      const { type } = e;
      const $target = $(e.target);
      const targetOutside = !$target.is(this.allTriggerSelector) && !$target.is(`[${TARGET_DATA}="${this.id}"]`) && !$target.parents(`[${TARGET_DATA}="${this.id}"]`).length && !$target.parents(this.allTriggerSelector).length;
      const pressedEsc = type === 'keydown' && momappoki.utilities.convertKeyCode(e).isEsc;

      if ((type === 'click' && targetOutside) || pressedEsc) {
        pressedEsc && this.$lastTrigger.focus();
        this._internalToggle(this.$lastTrigger, false, false);
      }
    }

    toggle ($trigger, active, inactive = false) {
      const {
        canCloseAll,
        groupID,
        spotlight,
        thereCanOnlyBeOne
      } = this.options;
      const makeActive = typeof (active) === 'boolean' ? active : !this.active;

      if (groupID) {
        if (spotlight) {
          this._shineSpotlight(groupID, makeActive);
        } else if (thereCanOnlyBeOne && makeActive || canCloseAll) {
          this._theQuickening(groupID, makeActive);
        }
      } else {
        this._internalToggle($trigger, makeActive, inactive);
      }
    }

    _internalToggle ($trigger, active, inactive = false) {
      this.active = typeof (active) === 'boolean' ? active : !this.active;
      const {
        animate,
        animation,
        dismissable,
        inactiveClass,
        targetRemoveClass,
        targetToggleClass,
        triggerRemoveClass,
        triggerToggleClass
      } = this.options;
      const targetActive = targetRemoveClass ? !this.active : this.active;
      const triggerActive = triggerRemoveClass ? !this.active : this.active;
      let targetAttrs = {};
      let triggerAttrs = {};

      if (this.targetAttrs) {
        targetAttrs = this.targetAttrs[targetActive ? 'active' : 'inactive'];
      }

      if (this.triggerAttrs) {
        triggerAttrs = this.triggerAttrs[triggerActive ? 'active' : 'inactive'];
      }

      if ($trigger && $trigger instanceof jQuery) {
        $trigger
          .toggleClass(triggerToggleClass, triggerActive)
          .toggleClass(inactiveClass, inactive)
          .attr(triggerAttrs);

        if (triggerActive) {
          this.$lastTrigger = $trigger;
        } else {
          this.$lastTrigger = null;
        }
      }

      this.$el
        .toggleClass(targetToggleClass, targetActive)
        .toggleClass(inactiveClass, inactive)
        .attr(targetAttrs);

      if (animate) {
        animation(this.$el, this.active);
      }

      if (targetActive) {
        this.options.onActive(this, $trigger);
      } else {
        this.options.onInactive(this, $trigger);
      }

      this.options.onToggle(this, this.active, $trigger);

      if (dismissable) {
        if (this.active) {
          $BODY.on(`${CLICK_ACTION}-dismiss keydown.${EVENT_NAMESPACE}-dismiss`, this._handleDismiss.bind(this));
        } else {
          $BODY.off(`${CLICK_ACTION}-dismiss keydown.${EVENT_NAMESPACE}-dismiss`);
        }
      }
    }
  }

  momappoki.components.Toggle = Toggle;
  window.momappoki = momappoki;
})(window.momappoki, window.jQuery, _);
