((momappoki = {}, $, _, window) => {
  momappoki.components = momappoki.components || {};

  const QUERY_PARAMS = _.get(momappoki, 'utilities.getQueryParams', $.noop);
  const LOG = _.get(momappoki, 'utilities.logMessage', $.noop);
  const DEFAULTS = {
    panelQueryParam: 'setPanel',
    activeClass: 'active-item',
    triggerData: 'data-tab-trigger',
    panelData: 'data-tab-panel',
    panelHolder: '[data-tab-panel-holder]',
    optData: 'data-tab-opts',
    trackStateTerms: {
      'true': 'opened',
      'false': 'closed'
    },
    onActive: $.noop,
    onInactive: $.noop,
    onChange: $.noop,
    onArrowKey: $.noop,
    _onArrowKey: $.noop, // internal
    onEnterKey: $.noop,
    _onEnterKey: $.noop, // internal
    onKey: $.noop,
    _onKey: $.noop // internal
  };

  momappoki.components.BaseTabs = class BaseTabs {
    baseInit ($el, options = {}) {
      this.$el = $el;

      const dataOpts = this.$el.attr(options.optData || DEFAULTS.optData) || {};

      this.options = $.extend(true, {}, DEFAULTS, options, dataOpts);
      this.collectPanels();

      if (!this.panelIDs.length) {
        LOG('base-tabs.js:%cNo Panels Set Up', 'color:red', this.$el);
      }

      this.activePanels = this.collectActive();
      this.$panelHolder = this.$el.find(this.options.panelHolder);
      this.$panels = this.$el.find(`[${this.options.panelData}]`);

      const params = QUERY_PARAMS(this.options.panelQueryParam);
      if (params) {
        const queryPanelIDS = _.intersection(this.panelIDs, params.split(':'));
        if (queryPanelIDS.length > 0) {
          this.setActiveTab(queryPanelIDS[0]);
        }
      }

      this.$el.on('keydown.base-tabs', `[${this.options.triggerData}]`, this.handleKeyboard.bind(this));
    }

    collectPanels () {
      this.panelIDs = this.$el.find(`[${this.options.triggerData}]`).toArray().map(el => $(el).attr(this.options.triggerData));
      LOG('base-tabs.js:%ccollecting all the panels', 'color:red', this.panelIDs);
    }

    collectActive () {
      const {
        activeClass,
        maxActive,
        minActive
      } = this.options;
      let active = this.panelIDs.filter(id => this.$el.find(`[${this.options.triggerData}="${id}"]`).is(`.${activeClass}`));

      if (active.length > maxActive) {
        active = _.drop(active, maxActive - minActive);
      } else if (active.length < minActive) {
        const panels = _.uniq([...active, ...this.panelIDs]);
        active = _.take(panels, minActive);
      }

      return active;
    }

    setA11y (active, id) {
      const attrs = {
        'aria-expanded': active,
        'data-track-state': this.options.trackStateTerms[active],
        'aria-selected': active
      };

      this.$el.find(`[${this.options.triggerData}="${id}"]`).attr(attrs);
      this.$el.find(`[${this.options.panelData}="${id}"]`).attr('aria-hidden', !active);
    }

    getNextEnabled (idx, isUp) {
      /**
        Splitting the list in two starting at the index that is passed so we can
        loop through the list to find the next panel that isn't disabled.
      **/
      const downList = [...this.panelIDs.slice(-(this.panelIDs.length), idx).reverse(), ...this.panelIDs.slice(idx, this.panelIDs.length).reverse()].reverse();
      const upList = [...this.panelIDs.slice(0, idx + 1).reverse(), ...this.panelIDs.slice(idx + 1, this.panelIDs.length)];
      const sortedList = isUp ? upList : downList;
      const nextID = _.find(sortedList, id => !this.$el.find(`[${this.options.triggerData}="${id}"]`).is('.disabled'));

      return this.panelIDs.indexOf(nextID);
    }

    focusContent (id) {
      if (this.activePanels.indexOf(id) > -1) {
        const $panel = this.$el.find(`[${this.options.panelData}="${id}"]`);
        const $dataFocus = $panel.find('[data-first-focus]');
        const $firstContent = $panel.find(':visible').not('div, ul, article, section, header, text').eq(0);
        const $firstFocus = $dataFocus.length ? $dataFocus : $firstContent;

        if (!$firstFocus.is(':focusable')) {
          $firstFocus.attr('tabindex', '-1');
        }

        $firstFocus.focus();
      }
    }

    focusTrigger (id) {
      this.$el.find(`[${this.options.triggerData}="${id}"]`).focus();
    }

    handleKeyboard (e) {
      const key = momappoki.utilities.convertKeyCode(e);
      const id = $(e.currentTarget).attr(this.options.triggerData);
      const tabIdx = this.panelIDs.indexOf(id);
      let nextIdx = null;

      if (typeof (id) !== 'undefined') {
        if ((key.isDir || key.isEnter)) {
          e.preventDefault();

          if (key.isEnter) {
            this.options._onEnterKey(id, this);
            this.options.onEnterKey(id, this);

            this.focusContent(id);
          } else if (key.isDir) {
            nextIdx = tabIdx + 1;

            if (key.isUp) {
              if (tabIdx === 0) {
                nextIdx = this.panelIDs.length - 1;
              } else {
                nextIdx = tabIdx - 1;
              }
            } else if (key.isDown && tabIdx === this.panelIDs.length - 1) {
              nextIdx = 0;
            }

            nextIdx = this.getNextEnabled(nextIdx, key.isUp);

            this.focusTrigger(this.panelIDs[nextIdx]);

            this.options._onArrowKey(key, id, nextIdx, this);
            this.options.onArrowKey(key, id, nextIdx, this);
          }
        }

        this.options._onKey(e, key, id, nextIdx, this);
        this.options.onKey(e, key, id, nextIdx, this);
      }
    }

    setActiveTab (id, switching) {
      const {
        activeClass
      } = this.options;
      const inactiveID = this.activePanels[0];

      this.activePanels = [id];

      this.$el
        .find(`[${this.options.triggerData}]`)
        .removeClass(activeClass)
        .filter(`[${this.options.triggerData}="${id}"]`)
        .addClass(activeClass)
        .end()
        .end()
        .find(`[${this.options.panelData}]`)
        .removeClass(activeClass)
        .filter(`[${this.options.panelData}="${id}"]`)
        .addClass(activeClass);

      this.setA11y(true, id);
      this.panelIDs.filter(panel => panel !== id).forEach(this.setA11y.bind(this, false));

      if (!switching) {
        this.options.onActive(id, this);
        this.options.onInactive(inactiveID, this);
        this.options.onChange(id, inactiveID, this);
      }
    }
  };

  window.momappoki = momappoki;
})(window.momappoki, jQuery, _, window);
