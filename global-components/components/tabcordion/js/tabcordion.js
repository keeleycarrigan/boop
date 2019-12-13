((momappoki = {}, $, _, postal, window) => {
  momappoki.components = momappoki.components || {};

  const { BaseTabs } = momappoki.components;
  const LOG = _.get(momappoki, 'utilities.logMessage', $.noop);
  const COMPONENT = 'momappoki_tabcordion';
  const TRIGGER_DATA = 'data-tabcordion-trigger';
  const PANEL_DATA = 'data-tabcordion-panel';
  const ITEM_DATA = 'data-tabcordion-item';
  const PANEL_HOLDER = '[data-tabcordion-panel-holder]';
  const DEFAULTS = {
    accordionBP: 'medium',
    maxActive: 1,
    minActive: 0,
    type: 'tabcordion', // Can also be tabs or accordion
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
    $('body').on('click.tabcordion', `[${TRIGGER_DATA}]`, handleTriggerClick);

    envInitialized = true;
  }

  function isActive ($trigger) {
    const $panel = $(`[${PANEL_DATA}="${$trigger.attr(TRIGGER_DATA)}"]`);

    return !$trigger.attr('disabled') && !$trigger.is('.disabled') && !$panel.attr('disabled') && !$panel.is('.disabled');
  }

  function handleTriggerClick (e) {
    e.preventDefault();

    const $clicked = $(e.currentTarget);
    const panelID = $clicked.attr(TRIGGER_DATA);
    /**
     * SOME browsers, looking at you Firefox, like to simulate clicks on spacebar
     * pressed. Since we already have an event that fires on spacebar for accordions
     * we don't want this click handler firing too. Especially since we are handling
     * keyboard presses on triggers already.
     */
    const simulatedClick = e.screenX === 0 && e.screenY === 0;

    if (!simulatedClick) {
      if (panelID && isActive($clicked)) {
        const tabcordions = instances.filter(inst => inst.panelIDs.indexOf(panelID) > -1);

        if (tabcordions.length) {
          tabcordions.forEach((tabcordion, idx) => {
            /**
              This is to account for an element being initialized, removed, and a
              similiar one being added later. Yes, this happens :(
            **/
            if (tabcordion.$el.length) {
              tabcordion.setActive(panelID);
            } else {
              instances = instances.filter((inst, instIdx) => instIdx !== idx);
            }
          });
        } else {
          LOG('tabcordion.js:%cTabcordion Panel ID doesn\'t exist', 'color:red');
        }
      }
    }
  }

  if (typeof (BaseTabs) === 'function') {
    momappoki.components.Tabcordion = class Tabcordion extends BaseTabs {
      constructor ($el, options = {}) {
        super();

        if (!(this instanceof Tabcordion)) { return new Tabcordion($el, options); }

        if ($el && $el instanceof jQuery && $el.length) {
          const tabcordionOpts = {
            triggerData: TRIGGER_DATA,
            panelData: PANEL_DATA,
            itemData: ITEM_DATA,
            panelHolder: PANEL_HOLDER,
            _onArrowKey: (key, id, nextIdx) => {
              if (!this.isAccordion) {
                this._setActive(this.panelIDs[nextIdx]);
              }
            },
            _onEnterKey: (id) => {
              this._setActive(id);
            },
            _onKey: (e, key, id) => {
              const { isSpace } = momappoki.utilities.convertKeyCode(e);

              if (isSpace && this.isAccordion) {
                e.preventDefault();

                this._setActive(id);
                this.focusContent(id);
              }
            }
          };

          let inst = $.data($el[0], COMPONENT);

          if (!inst) {
            inst = $.data($el[0], COMPONENT, this);
            instances = [...instances, this];

            super.baseInit($el, $.extend({}, DEFAULTS, options, tabcordionOpts));
            this.init();
          }

          return inst;
        }

        LOG('tabcordion.js:%cClass instances must be initialized with a jQuery element', 'color:red');
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

        if (this.options.type === 'tabcordion') {
          // Listens for changes in the breakpoint
          CHANNELS.mediaQuery.subscribe({
            topic: 'change.breakpoint',
            callback: this.checkAccordion.bind(this)
          });
        }

        this.checkAccordion();
      }

      checkAccordion () {
        const wasAccordion = this.isAccordion;
        const {
          accordionBP,
          maxActive,
          minActive,
          type
        } = this.options;

        this.isAccordion = type === 'accordion' || (momappoki.services.mediaQuery.isMax(accordionBP) && type === 'tabcordion');

        // Layout Changed.
        if (wasAccordion !== this.isAccordion) {
          if (!this.isAccordion) {
            // Just keep the last (most recent) ID added.
            this.activePanels = this.activePanels.length ? [this.activePanels[0]] : [this.panelIDs[0]];
          } else {

            if (this.activePanels.length > maxActive) {
              this.activePanels = _.drop(this.activePanels, maxActive - minActive);
            } else if (this.activePanels.length < minActive) {
              const panels = _.uniq([...this.collectActive(), ...this.panelIDs]);
              this.activePanels = _.take(panels, minActive);
            }
            this.$el.attr('multiselectable', maxActive > 1);
          }

          if (this.options.type === 'tabcordion') {
            this.setTabcordionPanels();
          }

          LOG('tabcordion.js:%cLayout changed. Layout is now %s, and the active panels are %s', 'color: green', this.isAccordion ? 'an accordion' : 'tabs', this.activePanels.join(', '));
          this.activePanels.forEach(id => this._setActive(id, true));
        }
      }

      // 'Private' method. Outside doesn't need access to pass the
      // 'switching' argument.
      _setActive (id, switching) {
        if (this.isAccordion) {
          this.setActiveAccordion(id, switching);
        } else if (!this.isAccordion && typeof (id) === 'string') {
          if (switching) {
            this.$el.find(`[${PANEL_DATA}]`).css('display', '');
          }

          this.setActiveTab(id, switching);
        }
      }

      setActive (id) {
        this._setActive(id);
      }

      setTabcordionPanels () {
        const $panels = this.$panels.detach();

        if (!this.isAccordion) {
          this.$panelHolder.append($panels);
        } else {
          $panels.toArray().forEach((panel) => {
            const id = $(panel).attr(PANEL_DATA);

            this.$el.find(`[${TRIGGER_DATA}="${id}"]`).after(panel);
          });
        }
      }

      setActiveAccordion (id, switching) {
        const {
          activeClass,
          maxActive,
          minActive
        } = this.options;
        const idExists = this.activePanels.indexOf(id) > -1;
        const $trigger = this.$el.find(`[${TRIGGER_DATA}="${id}"]`);
        const $panel = this.$el.find(`[${PANEL_DATA}="${id}"]`);

        if (switching) {
          $trigger.addClass(activeClass);
          $panel.addClass(activeClass).css('display', 'block');
          this.setA11y(true, id);
        } else {
          /**
            By passing ID as null or false you can close all active panels;
          **/
          if (id) {
            if (!idExists) {
              let closeID = null;

              if (this.activePanels.length + 1 > maxActive) {
                const otherPanels = this.activePanels.slice(0, -1);
                closeID = this.activePanels[this.activePanels.length - 1];

                this.activePanels = [id, ...otherPanels];

                LOG('tabcordion.js:%cActive panels over the limit. Closing %s. New active panels are %s', 'color:blue', closeID, this.activePanels.join(', '));

                this.closeAccordionPanel(closeID);
                this.options.onInactive(closeID, this);
              } else {
                this.activePanels = [id, ...this.activePanels];
              }

              this.setA11y(true, id);
              this.options.onActive(id, this);
              this.options.onChange(id, closeID, this);

              $trigger.addClass(activeClass);
              $panel
                .addClass(activeClass)
                .slideDown();
            } else if (this.activePanels.length - 1 >= minActive) {
              this.activePanels = this.activePanels.filter(panel => panel !== id);

              this.closeAccordionPanel(id);
              this.options.onInactive(id, this);
              this.options.onChange(null, id, this);
            }
          } else {
            const inactivePanels = this.activePanels.slice(minActive);

            inactivePanels.forEach((panelId) => {
              this.closeAccordionPanel(panelId);
            });

            this.activePanels = this.activePanels.slice(0, minActive);

            this.options.onInactive(inactivePanels, this);
            this.options.onChange(this.activePanels, inactivePanels, this);
          }
        }
      }

      closeAccordionPanel (id) {
        const {
          activeClass
        } = this.options;
        const $trigger = this.$el.find(`[${TRIGGER_DATA}="${id}"]`);
        const $panel = this.$el.find(`[${PANEL_DATA}="${id}"]`);

        this.setA11y(false, id);

        $panel
          .slideUp(() => {
            $trigger.removeClass(activeClass);
            $panel.removeClass(activeClass);
          });
      }
    };
  }

  window.momappoki = momappoki;
})(window.momappoki, jQuery, _, postal, window);
