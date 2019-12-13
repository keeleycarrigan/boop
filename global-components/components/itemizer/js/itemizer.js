((momappoki = {}, $, _) => {
  momappoki.components = momappoki.components || {};

  const LOG = momappoki.utilities.logMessage;

  const CUSTOM_FIELDS = 'data-itemizer-customs';
  const DATA_ACTION = 'data-itemizer-action';
  const DATA_ARIA = 'data-itemizer-aria';
  const DATA_FIELD = 'data-itemizer-field';
  const DATA_PREVIEW = 'data-itemizer-preview';
  const DATA_TARGET = 'data-itemizer-target';
  const LIMIT_MESSAGE = 'data-itemizer-message';

  const CUSTOM_TITLE = '<input name="title-<%= count %>" class="basic-input" aria-label="<%= aria %>">';
  const CUSTOM_AMOUNT = '<input type="text" name="<%= id %>-custom-<%= count %>" id="<%= id %>-amount-<%= count %>" class="basic-input" aria-label="<%= aria %>" data-itemizer-field="true">';

  /*
   *  Default Row template, mainly intended to serve as an example
   *  of what any overridding 'fieldTemplate' option should include
   */
  function basicRow (customTitle, customAmount) {
    return `<div class="row sm-margin-v3">
              <div class="sm-col-8">
                ${customTitle}
              </div>
              <div class="sm-col-4">
                ${customAmount}
              </div>
            </div>`;
  }

  /**
   * Maps a number passed in to a String
   * describing it relativly (ie. First, Second, Third)
   *
   * @param Number num
   * @return String
   */
  function mapCount (num) {
    let string;
    switch (num) {
      case 0: {
        string = 'First';
        break;
      }
      case 1: {
        string = 'Second';
        break;
      }
      case 2: {
        string = 'Third';
        break;
      }
      case 3: {
        string = 'Fourth';
        break;
      }
      case 4: {
        string = 'Fifth';
        break;
      }
      default: {
        string = 'Error count out of bounds';
      }
    }

    return string;
  }

  const DEFAULTS = {
    customLimit: 5,
    fieldTemplate: basicRow,
    titleAria: 'Custom Title Field',
    valueAria: 'Custom Amount Field',
    maskOpts: {
      decimals: 2, min: 0, prefix: '$', suffix: ''
    }
  };

  class MaskPolyFill {
    constructor ($el, options) {
      this.$el = $el;
      this.method = $el.is(':input') ? 'val' : 'text';
      this.options = options;
      LOG('log', `itemizer.js: %cPolyfilling InputMask on ${$el.attr('name') || $el.attr('id')}`, 'color:green;');
    }

    setFormattedValue (value) {
      const {
        method,
        options: {
          decimals,
          prefix,
          suffix
        }
      } = this;

      this.$el[method](momappoki.utilities.getFormattedNumber(value, decimals, prefix, suffix));
    }
  }

  /*
   * Basic Itemizer functionality
   * - Total fields and pass value to a designated preview and a separate 'target'
   * - Add additional fields up to a limit (Default: 5)
   */
  class Itemizer {
    constructor ($el, opts = {}) {
      this.$el = $el;
      this.customCount = 0;
      this.fields = {};
      this.id = this.$el.data('itemizer');
      this.options = $.extend(true, {}, DEFAULTS, opts);
      this.$ARIA_ANNOUNCER = this.$el.find(`[${DATA_ARIA}]`);
      this.$CUSTOM_FIELDS = this.$el.find(`[${CUSTOM_FIELDS}]`);
      // Where the total should be shown before it is 'submitted' to the target input
      this.preview = this.initTargetInput($(`[${DATA_PREVIEW}="${this.id}"]`));

      // The designated elements that recieves the total value.
      this.$target = $(`[${DATA_TARGET}="${this.id}"]`);
      // an Array that actually has the input mask methods or polyfills
      this.targets = _.map(this.$target, el => momappoki.components.InputMask.getInstance($(el)) || this.initTargetInput($(el)));

      // Loop through itemizer and process all of the fields found
      this.$el.find(`[${DATA_FIELD}]`).toArray().forEach( el => this.addField($(el)));
      this.$el.on('input', `[${DATA_FIELD}]`, this.updatePreview.bind(this))
        .on('click', `[${DATA_ACTION}]`, this.handleClick.bind(this));
    }

    // If a target does not already have an inputMask instance
    initTargetInput ($el) {
      const { maskOpts } = this.options;
      // Either initialize one if there are options on the element for it,
      if ($el.is('[data-input-mask-opts]').length > 0) {
        return this.initInput($el);
      }
      // or polyfill the element to match how we'll interface.
      return new MaskPolyFill($el, maskOpts);
    }

    initInput ($el) {
      const { maskOpts } = this.options;
      return new momappoki.components.InputMask($el, maskOpts);
    }

    addField ($el) {
      this.fields[$el.attr('name')] = {
        $el,
        input: this.initInput($el)
      };
    }

    updatePreview () {
      this.total = _.sum(this.getValues());
      this.preview.setFormattedValue(this.total);
    }

    getValues () {
      const values = _.map(this.fields, (field) => {
        const { $el } = field;
        return momappoki.utilities.getCleanNumber($el.val());
      });
      return values;
    }

    handleClick (e) {
      e.preventDefault();
      const $el = $(e.currentTarget);
      const type = $el.data('itemizer-action');
      if (type === 'add') {
        this.newField();
      } else if (type === 'clear') {
        this.clearFields();
      } else { // type === 'submit'
        this.submitTotal();
      }
    }

    clearFields () {
      _.forEach(this.fields, (value) => {
        const { input } = value;
        input.setFormattedValue(0);
      });
      this.updatePreview();
    }

    submitTotal () {
      this.updatePreview();
      this.targets.forEach( tar => tar.setFormattedValue(this.total));
    }

    /* Add a new custom field to the itemizer
     * max custom fields is limited to 5 by default
    */
    newField () {
      const {
        $ARIA_ANNOUNCER,
        $CUSTOM_FIELDS,
        customCount: count,
        id,
        options: {
          customLimit,
          titleAria,
          valueAria
        }
      } = this;

      if (count < customLimit) {
        /*
         * creates the input templates,
         * passes them into the row template, and
         * appends the row to the custom fields container
        */
        const tAria = `${mapCount(count)} ${titleAria}`;
        const vAria = `${mapCount(count)} ${valueAria}`;
        const title = _.template(CUSTOM_TITLE)({ count, aria: tAria });
        const amount = _.template(CUSTOM_AMOUNT)({ count, aria: vAria, id });
        const $renderedRow = $(this.options.fieldTemplate(title, amount));
        $CUSTOM_FIELDS.append($renderedRow);

        const $newTitle = $renderedRow.find('[name^="title"]');
        // Grabs the new DOM node and initializes it as an input
        const $newField = $renderedRow.find(`[${DATA_FIELD}]`);
        this.addField($newField);
        this.customCount++;
        $newTitle.focus();
        if (this.customCount === customLimit) {
          this.$el.find(`[${DATA_ACTION}="add"]`).addClass('off');
          const $message = this.$el.find(`[${LIMIT_MESSAGE}]`);
          const messageText = $message.text();
          $ARIA_ANNOUNCER.text(messageText);
          $message.removeClass('off');
        }
      }
    }
  }

  momappoki.components.Itemizer = Itemizer;
})(window.momappoki, $, _);
