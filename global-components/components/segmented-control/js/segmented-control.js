((momappoki = {}, $, _, window, document) => {
  momappoki.components = momappoki.components || {};

  const LOG = _.get(momappoki, 'utilities.logMessage', $.noop);
  const { BaseTabs } = momappoki.components;
  const COMPONENT = 'momappoki_segmented_ctrl_nav';
  const TRIGGER_DATA = 'data-seg-ctrl-trigger';
  const PANEL_DATA = 'data-seg-ctrl-panel';
  const ITEM_DATA = 'data-seg-ctrl-trigger';
  const PANEL_HOLDER = '[data-seg-ctrl-panel-holder]';
  const NAV_SELECT = '[data-seg-ctrl-select]';
  const DEFAULTS = {
    selectNavBP: 'medium',
    type: 'nav',
    trackStateTerms: {
      'true': 'active',
      'false': 'inactive'
    },
    onActive: $.noop,
    onInactive: $.noop,
    onChange: $.noop,
    onEnterKey: $.noop,
    onArrowKey: $.noop,
    onKey: $.noop
  };
  const CHANNELS = {
    'mediaQuery': postal.channel('momappoki.media-query')
  };
  let instances = [];
  let envInitialized = false;

  function initEnv () {
    /**
      Setting this to delegate from document so links outside the main element
      can change panels. They just need the right panel ID.
    **/
    $('body').on('click.seg-nav', `[${TRIGGER_DATA}]`, handleTriggerClick);

    envInitialized = true;
  }

  function handleTriggerClick (e) {
    e.preventDefault();

    const $clicked = $(e.currentTarget);
    const panelID = $clicked.attr(TRIGGER_DATA);

    if (typeof (panelID) !== 'undefined' && !$clicked.attr('disabled') && !$clicked.is('.disabled')) {
      const segCtrls = instances.filter(inst => inst.panelIDs.indexOf(panelID) > -1);

      if (segCtrls.length) {
        segCtrls.forEach((segCtrl, idx) => {
          /**
            This is to account for an element being initialized, removed, and a
            similiar one being added later. Yes, this happens :(
          **/
          if (segCtrl.$el.length) {
            segCtrl.setActive(panelID);
          } else {
            instances = instances.filter((inst, instIdx) => instIdx !== idx);
          }
        });
      } else {
        LOG('segmented-control.js:%cSegCtrl Panel ID doesn\'t exist', 'color:red');
      }
    }
  }

  if (typeof (BaseTabs) === 'function') {
    momappoki.components.SegmentedCtrl = class SegmentedCtrl extends BaseTabs {
      constructor ($el, options = {}) {
        super();

        if (!(this instanceof SegmentedCtrl)) { return new SegmentedCtrl($el, options); }

        if ($el && $el instanceof jQuery && $el.length) {
          const segNavOpts = {
            triggerData: TRIGGER_DATA,
            panelData: PANEL_DATA,
            itemData: ITEM_DATA,
            panelHolder: PANEL_HOLDER,
            _onArrowKey: (key, id, nextIdx) => {
              this.setActive(this.panelIDs[nextIdx]);
            },
            _onEnterKey: (id) => {
              this.setActive(id);
            }
          };

          let inst = $.data($el[0], COMPONENT);

          if (!inst) {
            inst = $.data($el[0], COMPONENT, this);
            instances = [...instances, this];

            super.baseInit($el, $.extend({}, DEFAULTS, options, segNavOpts));
            this.init();
          }

          return inst;
        }

        LOG('segmented-control.js:%cClass instances must be initialized with a jQuery element', 'color:red');
      }

      static getInstance ($el) {
        let inst = null;

        if ($el && $el instanceof jQuery && $el.length) {
          inst = $.data($el[0], COMPONENT);
        }

        return inst;
      }

      init () {
        if (!envInitialized) {
          initEnv();
        }

        this.$triggers = this.$el.find(`[${TRIGGER_DATA}]`);
        this.$navSelect = this.$el.find(NAV_SELECT);

        this.$navSelect
          .val(this.activePanels)
          .attr({ 'data-track-value': this.activePanels });

        if (this.options.type === 'input') {
          this.$triggers.filter(`:not(.${this.options.activeClass})`).attr('tabindex', -1);
        }

        CHANNELS.mediaQuery.subscribe({
          topic: 'change.breakpoint',
          callback: this.checkNavSelect.bind(this)
        });

        this.checkNavSelect();
        this.setDisabled(...this.getDisabled());
      }

      checkNavSelect () {
        this.navSelectActive = momappoki.services.mediaQuery.isMax(this.options.selectNavBP);

        if (this.navSelectActive) {
          this.$navSelect.on('change.seg-nav', this.setActiveSelect.bind(this));
        } else {
          this.$navSelect.off('change.seg-nav');
        }
      }

      getDisabled () {
        const triggers = this.$triggers.filter(':disabled, .disabled').toArray().map(el => $(el).attr(TRIGGER_DATA));
        const options = this.$navSelect.find(':disabled').toArray().map(el => $(el).attr('value'));

        return _.uniq([...triggers, ...options]);
      }

      setDisabled (...disable) {
        this.$triggers.removeClass('disabled');
        this.$navSelect.find('option').attr('disabled', false);

        disable.forEach((val) => {
          this.$triggers.filter(`[${TRIGGER_DATA}="${val}"]`).addClass('disabled');
          this.$navSelect.find(`[value="${val}"]`).attr('disabled', true);
        });
      }

      setActiveSelect () {
        const panelID = this.$navSelect.val().trim();

        this.$navSelect.attr({ 'data-track-value': panelID });

        this.setActiveTab(panelID);
      }

      setActive (panelID) {
        this.setActiveTab(panelID);
        this.$navSelect
          .val(panelID)
          .attr({ 'data-track-value': panelID });

        if (this.options.type === 'input') {
          this.$triggers
            .attr('tabindex', -1)
            .filter(`[${TRIGGER_DATA}="${panelID}"]`)
            .attr('tabindex', '');
        }
      }
    };
  }
})(window.momappoki, jQuery, _, window, document);
