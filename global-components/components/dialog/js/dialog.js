((boop, $, window, history) => {
  'use strict';

  const historySupported = typeof (history.pushState) === 'function';
  const $HTML = $('html');
  const $BODY = $('body');
  const COMPONENT = 'mod_dialog';
  const ALL_OVERLAYS = [];
  const DIALOG_SIZES = ['small', 'medium', 'large'];
  let activeOverlay = null;
  let switchingOverlay = false;
  let envInitialized = false;
  const defaults = {
    activePageClass: 'dialog-active',
    ajax: {
      settings: {},
      context: false
    },
    autoShow: {
      active: false,
      saveClose: true,
      saveCloseDuration: 30
    },
    closeBtn: {
      /**
      data-close-dialog attribute on
      any link will close the dialog
      **/
      attrs: {
        'aria-label': 'Close',
        'class': 'action-btn-close',
        'data-close-dialog': '',
        'data-track-ui': 'modal',
        'data-track-elem': 'icon',
        'data-track-name': 'Close',
        'data-track-trigger': 'close',
        'role': 'button',
        'html': '<i aria-hidden="true" class="boopcon-glyph-close"></i>',
        'href': '#'
      }
    },
    clickOutsideToHide: true,
    content: {
      attrs: {
        'class': 'boop-dialog-content'
      },
      custom: null,
      loadFail: '<p class="boop-dialog-content-fail">Request Failed</p>',
      loadMsg: '<p class="boop-dialog-load-msg">Loading...</p>',
      modifier: '',
      type: 'inline'
    },
    customTemplate: null,
    backgroundContainer: null,
    dialog: {
      active: 'show',
      attrs: {
        'class': 'boop-dialog-wrap',
        'data-track-ui': 'modal',
        'tabindex': '-1'
      },
      modifier: '',
      size: 'medium'
    },
    dialogURL: null,
    lazyload: true,
    modal: {
      attrs: {
        'aria-hidden': true,
        'class': 'boop-dialog'
      },
      modifier: ''
    },
    onInit: $.noop,
    onContentLoaded: $.noop,
    onCreate: $.noop,
    onShow: $.noop,
    onBeforeShow: $.noop,
    onHide: $.noop,
    onBeforeHide: $.noop,
    trigger: {
      activeClass: 'dialog-trigger-active'
    }
  };
  function showDialog (e) {
    e.preventDefault();

    const $trigger = $(e.currentTarget);
    const id = $trigger.data('dialog-trigger');
    const $modal = $(`#${id}`);
    let inst = null;

    if ($modal.length) {
      inst = $.data($modal[0], COMPONENT);
      switchingOverlay = activeOverlay && inst !== activeOverlay;

      if (inst) {
        if (activeOverlay) {
          activeOverlay.hide();
        }

        /**
        Attaching the trigger of the dialog to the instance, so it can
        be tracked and manipulated if desirable.
        **/
        inst.$trigger = $trigger;
        inst.show(true);
      }
    }
  }
  function checkOverlayStorage () {
    /**
    This checks to see if an auto show modal that should stay
    closed for a specified number of days should continue to
    stay closed.
    **/
    const currentDate = Date.now();
    let storedData = JSON.parse(localStorage.getItem(COMPONENT));

    if (storedData && storedData.keepClosed) {
      for (let key in storedData.keepClosed) {
        if (Object.prototype.hasOwnProperty.call(storedData.keepClosed, key)) {
          if (storedData.keepClosed[key] <= currentDate) {
            delete storedData.keepClosed[key];

            storedData = JSON.stringify(storedData);

            localStorage.setItem(COMPONENT, storedData);
          }
        }
      }
    }
  }
  function escClose (e) {
    if (e.keyCode === 27 && activeOverlay) {
      activeOverlay.hide(true);
    }
  }
  function showByURL (urlHash, inst) {
    console.log(urlHash)
    if (inst.options.dialogURL === urlHash) {
      inst.show();
    }
  }
  function stillExists (overlay) {
    return overlay && overlay.$el.length;
  }
  function trackHistory () {
    if (history.state && history.state.dialog) {
      ALL_OVERLAYS.filter(stillExists).forEach(showByURL.bind(null, history.state.dialog));
    } else if (activeOverlay) {
      activeOverlay.hide();
    }
  }
  function initEnv () {
    $BODY
      .on('click.dialog', '[data-dialog-trigger]', showDialog)
      .on('keyup', escClose);

    if (historySupported) {
      $(window).on('popstate.dialog.history', trackHistory);
    }

    checkOverlayStorage();
    envInitialized = true;
  }

  class Dialog {
    constructor ($el, options = {}) {
      this.contentLoaded = false;

      const dialogID = $el.data('dialog-trigger') || $el.attr('id');
      const $dialog = $(`#${dialogID}`);
      const dataOpts = $el.data('dialog-opts') || {};
      let inst = null;

      this.options = $.extend(true, {}, defaults, options, dataOpts);
      this.dialogID = dialogID;

      if ($dialog.length) {
        this.contentLoaded = true;
        inst = $.data($dialog[0], COMPONENT);

        if (!inst) {
          inst = $.data($dialog[0], COMPONENT, this);

          this.processHTML($dialog);
          this.init($dialog);
        }
      } else {
        inst = this;
        this.create($el, dialogID);
      }

      return inst;
    }

    static getInstance ($el) {
      let inst = null;

      if ($el && $el instanceof jQuery && $el.length) {
        const $element = $el.is('[data-dialog-trigger]') ? $(`#${$el.data('dialog-trigger')}`) : $el;

        inst = $.data($element[0], COMPONENT);
      }

      return inst;
    }

    storeClosed () {
      const currentDate = new Date();
      const endDate = new Date().setDate(currentDate.getDate() + this.options.autoShow.saveCloseDuration);
      let storedData = JSON.parse(localStorage.getItem(COMPONENT));

      if (!storedData) {
        storedData = { 'keepClosed': {} };
      }

      storedData.keepClosed[this.dialogID] = endDate;

      localStorage.setItem(COMPONENT, JSON.stringify(storedData));
    }

    shouldShow () {
      const urlHash = window.location.hash.slice(1);
      const modalUrl = this.options.dialogURL;
      const storedData = JSON.parse(localStorage.getItem(COMPONENT));
      const keepClosed = storedData && storedData.keepClosed && Object.prototype.hasOwnProperty.call(storedData.keepClosed, this.dialogID);

      return (modalUrl && urlHash === modalUrl) || (this.options.autoShow.active && urlHash === '' && !keepClosed);
    }

    hide (triggerHistory) {
      if (this.options.dialogURL && triggerHistory && historySupported) {
        /**
        This check is for when the user goes to a linked modal directly, and
        presses the 'close' button on the modal instead of pressing 'back'.
        **/
        if (history.state) {
          history.go(-1);
        } else {
          history.replaceState(null, null, window.location.pathname);
        }
      }

      this.options.onBeforeHide(this);
      this.$el.removeClass(this.options.dialog.active);
      this.$modal.attr('aria-hidden', true);
      this.$el.off('keydown.boop-dialog', this.trapFocus);

      if (this.backgroundContainer && this.backgroundContainer.length) {
        this.backgroundContainer.attr('aria-hidden', false);
      }

      if (this.$trigger) {
        if (this.options.trigger.activeClass) {
          this.$trigger.removeClass(this.options.trigger.activeClass);
        }

        if (!switchingOverlay) {
          /**
          This is so if a new dialog is opening right after this one is closing,
          this dialog's trigger doesn't get focus.
          **/
          this.$trigger.focus();
        }

        this.$trigger = null;
      }

      if (this.options.autoShow.active && this.options.autoShow.saveClose) {
        this.storeClosed();
      }

      activeOverlay = null;
      $HTML.removeClass(this.options.activePageClass);
      this.options.onHide(this);

      $BODY.trigger('boop.dialog-hide', this);

      return this;
    }

    handleClose (e) {
      e.preventDefault();

      this.hide(true);
    }

    dismissOverlay (e) {
      if (e.target === this.$dialog[0]) {
        this.hide(true);
      }
    }

    trapFocus (e) {
      if (e.which === 9) {
        const currentFocus = this.$focusableItems.index(this.$el.find(':focus'));
        const lastFocusItem = this.$focusableItems.length - 1;

        if (e.shiftKey) {
          if (currentFocus === 0) {
            e.preventDefault();

            this.$focusableItems.eq(lastFocusItem).focus();
          }
        } else if (currentFocus === lastFocusItem) {
          e.preventDefault();
          this.$focusableItems.eq(0).focus();
        }
      }
    }

    show (triggerHistory) {
      return this.addContent().then(() => {
        if (this.options.dialogURL && triggerHistory && historySupported) {
          history.pushState({ dialog: this.options.dialogURL }, null, `#${this.options.dialogURL}`);
        }

        this.options.onBeforeShow(this);
        this.$el.addClass(this.options.dialog.active);
        this.$modal.attr('aria-hidden', false);
        this.$el.on('keydown.boop-dialog', this.trapFocus.bind(this));

        this.$firstFocus.focus();

        if (this.backgroundContainer && this.backgroundContainer.length) {
          this.backgroundContainer.attr('aria-hidden', true);
        }

        if (this.$trigger && this.options.trigger.activeClass) {
          this.$trigger.addClass(this.options.trigger.activeClass);
        }

        activeOverlay = this;

        $HTML.addClass(this.options.activePageClass);
        this.options.onShow(this);

        $BODY.trigger('boop.dialog-show', this);

        return this;
      });
    }

    makeAccessible ($dialog) {
      const $header = this.$content.find(':header');
      const $firstContent = this.$content.find(':visible').not('div, ul, article, section').eq(0);

      $dialog.attr({ 'tabindex': '-1' });
      this.$closeBtn.attr({ 'tabindex': '0', 'role': 'button' });
      this.$modal.attr({ 'aria-hidden': true });
      this.$firstFocus = $header.length ? $header.eq(0) : $firstContent;

      if (this.$firstFocus.is(':header')) {
        this.$firstFocus.attr('tabindex', '0');
      } else if (!this.$firstFocus.is(':focusable')) {
        this.$firstFocus.attr('tabindex', '-1');
      }

      this.$focusableItems = this.$modal.find(':focusable, [tabindex="0"]').filter(':visible');

      if (!this.$firstFocus.length) {
        this.$firstFocus = this.$focusableItems.eq(0);
      }

      return $dialog;
    }

    getDialogModifiers (dialogClasses) {
      const {
        modifier,
        size
      } = this.options.dialog;
      const modClasses = typeof (modifier) === 'string' ? modifier.split(' ') : [];
      const noDialogSize = !dialogClasses.split(' ').some(dialogClass => DIALOG_SIZES.indexOf(dialogClass) > -1);
      let modalModifiers = '';

      if (modifier.trim() === '' && noDialogSize) {
        /**
          If no modifiers are passed and the dialog doesn't have a size class already.
        **/
        modalModifiers = size;
      } else if (!modClasses.some(mod => DIALOG_SIZES.indexOf(mod) > -1) && noDialogSize) {
        /**
          If modifiers are passed, but none are a size class and the dialog
          doesn't have a size class already.
        **/
        modalModifiers = [...modClasses, size].join(' ');
      } else {
        modalModifiers = modifier;
      }

      return modalModifiers;
    }

    processHTML (html) {
      const $dialog = $(html);

      this.$dialog = $dialog.addClass(this.getDialogModifiers($dialog.attr('class')));
      this.$modal = this.$dialog.find(`.${this.options.modal.attrs.class}`).addClass(this.options.modal.modifier);
      this.$content = this.$dialog.find(`.${this.options.content.attrs.class}`).addClass(this.options.content.modifier);
      this.$closeBtn = this.$dialog.find(`.${this.options.closeBtn.attrs.class}`);

      return this.makeAccessible(this.$dialog);
    }

    buildOverlay (id) {
      if (this.options.customTemplate) {
        this.processHTML(this.options.customTemplate).attr('id', id);
      } else {
        this.$modal = $('<div />', this.options.modal.attrs).addClass(this.options.modal.modifier);
        this.$modalActions = $('<div />', { class: 'boop-dialog-actions' });
        this.$content = $('<div />', this.options.content.attrs).addClass(this.options.content.modifier);
        this.$closeBtn = $('<a />', this.options.closeBtn.attrs);

        this.options.dialog.attrs.id = id;
        this.$dialog = $('<div />', this.options.dialog.attrs)
          .addClass(this.getDialogModifiers(this.options.dialog.modifier))
          .append(this.$modal.append([this.$content, this.$modalActions.append(this.$closeBtn)]));
      }

      if (!this.contentLoaded) {
        this.$content.append(this.options.content.loadMsg);
      }

      return this.makeAccessible(this.$dialog.appendTo('body'));
    }

    parseAjaxData (data) {
      let parsed = data;

      if (this.options.ajax.context) {
        const $data = $(data);

        parsed = $data.find(this.options.ajax.context);

        if (parsed.length < 1) {
          parsed = $data.filter(this.options.ajax.context);
        }
      }

      return parsed;
    }

    buildContent () {
      const def = $.Deferred();

      switch (this.options.content.type) {
        case 'image': {
          const img = new Image();

          img.src = this.contentSrc;

          img.onload = () => {
            def.resolve(img);
          };

          img.onerror = () => {
            def.reject(this.options.content.loadFail);
          };

          break;
        }
        case 'iframe':
          def.resolve($('<iframe>', { 'src': this.contentSrc }));

          break;
        case 'ajax':
          $.ajax($.extend({ url: this.contentSrc }, this.options.ajax.settings))
            .done(data => def.resolve(this.parseAjaxData(data)))
            .fail(() => def.reject(this.options.content.loadFail));

          break;
        case 'custom':
          def.resolve(this.options.content.custom);

          break;
        default:
          def.resolve(this.options.content.loadMsg);

          break;
      }

      return def.promise();
    }

    addContent () {
      const def = $.Deferred();

      if (!this.contentLoaded) {
        this.buildContent().then((content) => {
          this.$content.html(content);
          this.makeAccessible(this.$dialog);
          this.contentLoaded = true;

          this.options.onContentLoaded(this);
          def.resolve();
        });
      } else {
        def.resolve();
      }

      return def.promise();
    }

    create ($el, id) {
      this.contentSrc = $el.attr('href');

      this.init(this.buildOverlay(id));
      this.options.onCreate(this);
    }

    refreshFocusableItems () {
      this.$focusableItems = this.$modal.find(':focusable, [tabindex="0"]').filter(':visible');
    }

    setOptions (options = {}) {
      this.options = $.extend(true, {}, this.options, options);
    }

    init ($el) {
      this.options.onInit(this);

      this.$el = $el;
      this.el = $el[0];
      this.backgroundContainer = this.options.backgroundContainer && $(this.options.backgroundContainer);

      /**
      This keeps track of the trigger that opened the dialog
      so when the dialog closes focus can be returned to that
      trigger.
      **/
      this.$trigger = null;

      const shouldShow = this.shouldShow();

      /**
      If the content isn't loaded and it's not a lazyload dialog OR
      if the dialog should show immediately and the content isn't loaded.
      **/
      if ((!this.contentLoaded && !this.options.lazyload) || (shouldShow && !this.contentLoaded)) {
        this.addContent();
      }

      /**
      Make sure an instance is on the dialog in case it
      was dynamicboop built.
      **/
      if (!$.data(this.el, COMPONENT)) {
        $.data(this.el, COMPONENT, this);
      }

      ALL_OVERLAYS.push(this);

      this.$el.on('click.close-dialog', '[data-close-dialog]', this.handleClose.bind(this));

      if (this.options.clickOutsideToHide) {
        this.$el.on('click.dismiss-dialog', this.dismissOverlay.bind(this));
      }

      if (!envInitialized) {
        initEnv();
      }

      if (shouldShow) {
        this.show();
      }
    }
  }

  boop.components = boop.components || {};
  boop.components.Dialog = Dialog;

  window.boop = boop;
})(window.boop || {}, jQuery, window, window.history);
