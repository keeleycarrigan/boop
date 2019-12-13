((momappoki = {}, $, _, window) => {
  momappoki.utilities = momappoki.utilities || {};

  // set this to true for console logs
  const LOG = _.get(momappoki, 'utilities.logMessage', $.noop);
  const MOD_NAME = 'momappoki-validator';
  const CLEAN_NUMBER = _.get(momappoki, 'utilities.getCleanNumber', $.noop);

  /**
   *  a list of methods to validate different fields
   *  returns true if they pass validation
   */
  const inputValidators = {
    radio ($el) {
      return $(`[name="${$el.attr('name')}"]:checked`).length > 0;
    },
    checkbox ($el) {
      return $(`[name="${$el.attr('name')}"]:checked`).length > 0;
    },
    owasp (val) {
      const value = val.replace(/\s+/g, ' ').trim();
      return !!value.replace(/[a-z ,.'-]+/ig, '').length;
    },
    email (val) {
      return val.match(/^[-0-9A-Za-z!#$%&'*+/=?^_`{|}~]+(\.[-0-9A-Za-z!#$%&'*+/=?^_`{|}~]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/ig);
    },
    phone (val) {
      return val.replace(/^[0]/g, '').replace(/[\D]/g, '').length >= 10;
    },
    zipcode (val) {
      const zRegEx = new RegExp('^\\d{5}(?:[-\\s]\\d{4})?$');

      return zRegEx.test(val);
    },
    equals (val, matchID) {
      const $other = $(`#${matchID}`);

      return $other.length && $other.val().trim() === val;
    },
    required (val) {
      return typeof (val) === 'string' && val.trim().length > 0;
    },
    integers (val) {
      const intRegEx = new RegExp('^\\d+$');

      return intRegEx.test(val);
    },
    compare (type = 'min', val, amount) {
      const input = typeof (val) === 'number' ? val : CLEAN_NUMBER(val.trim() === '' ? 0 : val);
      const comparison = typeof (amount) === 'number' ? amount : CLEAN_NUMBER(amount);
      let valid = false;

      if (!isNaN(input) && !isNaN(comparison)) {
        valid = type === 'min' ? (input >= comparison) : (input <= comparison);
      }

      return valid;
    },
    min (val, amount) {
      return inputValidators.compare('min', val, amount);
    },
    max (val, amount) {
      return inputValidators.compare('max', val, amount);
    },
    range (val, min, max) {
      return inputValidators.min(val, min) && inputValidators.max(val, max);
    }
  };
  const errorMsgClass = 'basic-form-error-msg';
  const errorContainerClass = 'has-error';
  const axErrorMsg = 'data-validator-field';

  const DEFAULTS = {
    errorMessages: {
      generic: 'Please enter a valid input.',
      firstName: 'Please enter a valid first name.',
      lastName: 'Please enter a valid last name.',
      phone: 'Please enter a valid phone number.',
      email: 'Please enter a valid email address.'
    },
    inputValidators,
    axErrorTemplate: `<a href="#" class="basic-form-ax-error-msg" ${axErrorMsg}="<%= id %>"><%= message %></a>`,
    errorTemplate: `<p id="<%= id %>" class="${errorMsgClass}" aria-live="polite"><%= message %></p>`,
    errorTemplateWithIcon: `<p id="<%= id %>" class="${errorMsgClass}" aria-live="polite"><i class="icon-alert" aria-hidden="true"></i> <%= message %></p>`,
    fieldData: {},
    useErrorIcon: false,
    errorLimit: 1
  };

  class Validator {
    constructor ($el, options = {}) {
      if (!(this instanceof Validator)) { return new Validator($el, options); }

      let inst = $.data($el[0], MOD_NAME);

      if (!inst) {
        inst = $.data($el[0], MOD_NAME, this);
        this.create($el, options);
      }

      return inst;
    }

    create ($el, options) {
      this.$el = $el;
      this.$axErrorContainer = $(`[data-validator-ax-errors="${this.$el.attr('id')}"]`);

      this.$el.on('click', `[${axErrorMsg}]`, this.onAxErrorPress.bind(this));

      const dataOpts = this.$el.data('dialog-opts') || {};

      this.options = _.merge({}, DEFAULTS, options, dataOpts);
      this.updateInputs();
    }

    getFieldData (overideDOM) {
      const fields = this.$inputs.toArray();
      const domFieldData = fields.reduce((obj, el) => {
        const $el = $(el);
        const dataOpts = $el.data('validator');
        const fieldName = $el.attr('name');
        const type = dataOpts.title || $el.attr('type');
        const defaultValidators = { validators: _.without(['required', type], 'text', 'select') };
        const fieldOptsData = _.get(this.options, `fieldData.${fieldName}`, {});
        const fieldData = _.get(this.fieldData, `${fieldName}`, dataOpts || defaultValidators);
        const errors = _.get(this.fieldData, `${fieldName}.errors`, []);

        $el.attr('aria-describedby', `${fieldName}-error-msg`);

        obj[fieldName] = _.merge({}, fieldOptsData, fieldData, { errors, type });

        return obj;
      }, {});

      return overideDOM ? _.merge({}, domFieldData, this.options.fieldData) : _.merge({}, this.options.fieldData, domFieldData);
    }

    updateOptions (options = {}, overideDOM = true) {
      this.options = _.merge({}, this.options, options);

      this.fieldData = this.getFieldData(overideDOM);

      return this;
    }

    updateFieldData (fieldData = {}) {
      this.options = _.merge({}, this.options, { fieldData });

      this.fieldData = this.getFieldData(true);

      return this;
    }

    replaceFieldData (fieldData = {}, overideDOM = true) {
      const newFieldData = _.reduce(fieldData, (obj, val, key) => {
        const currentFieldData = this.fieldData[key] || {};

        obj[key] = {
          ...currentFieldData,
          ...val
        };

        return obj;
      }, {});

      this.fieldData = {
        ...this.getFieldData(overideDOM),
        ...newFieldData
      };

      return this;
    }

    updateInputs () {
      this.$inputs = this.$el.find('[data-validator], [required]');
      this.getFieldNames();
      this.fieldData = this.getFieldData();

      return this;
    }

    getFieldNames () {
      this.allFieldNames = _.uniq(this.$el.find(':input').not('[type="submit"]').toArray().map(el => $(el).attr('name')));

      return this;
    }

    validateForm () {
      this.$inputs.each((i, el) => {
        this.validateSingleInput($(el));
      });

      return this;
    }

    onAxErrorPress (e) {
      e.preventDefault();

      const inputID = $(e.currentTarget).attr(axErrorMsg);

      this.$inputs
        .filter((idx, el) => $(el).attr('name') === inputID)
        .focus();
    }

    hasErrors ($el) {
      const inputID = ($el && $el instanceof jQuery) && $el.attr('name');

      return this.fieldData[inputID] ? this.fieldData[inputID].errors.length : _.some(this.fieldData, field => field.errors.length);
    }

    parseValue ($input) {
      const inputID = $input.attr('name');
      const type = _.get(this.fieldData, `${inputID}.type`) || $input.attr('type');
      let parsed = $input.val().trim();

      if (type === 'checkbox' && parsed === 'on') {
        parsed = $input.is(':checked');
      } else if (type === 'radio' && $input.filter(':checked').val()) {
        parsed = $input.filter(':checked').val().trim();
      }

      return parsed;
    }

    getValues () {
      return this.allFieldNames.reduce((obj, input) => {
        const $input = this.$el.find(`[name=${input}]`);
        const inputID = $input.attr('name');
        const valData = _.get(this.fieldData, `${inputID}`) || $input.data('validator') || {};
        const type = valData.type || $input.attr('type');
        const value = this.parseValue($input);

        if ((typeof (value) === 'string' && value.length) || typeof (value) === 'boolean') {
          if (type === 'number') {
            obj[input] = CLEAN_NUMBER(value);
          } else {
            obj[input] = value;
          }
        }

        return obj;
      }, {});
    }

    getParent ($el) {
      const $wrapper = $el.closest('[data-error-wrapper]');
      return $wrapper.length ? $wrapper : $el.closest('fieldset');
    }

    getErrorTarget ($parent, fieldName) {
      const $errorTarget = $parent.is($(`[data-error-target="${fieldName}"]`)) ? $parent : $parent.find($(`[data-error-target="${fieldName}"]`));
      return $errorTarget.length ? $errorTarget : $parent;
    }

    singleInputHasError (input) {
      const id = input instanceof jQuery ? input.attr('name') : input;

      return this.fieldData[id].errors.length;
    }

    validateSingleInput ($el, force) {
      const inputID = $el.attr('name');
      const inputVal = $el.val().trim();
      const valData = _.get(this.fieldData, `${inputID}`) || $el.data('validator') || {};
      const type = valData.type || $el.attr('type');
      const validators = valData.validators || [];
      let isValid = false;

      if (typeof valData === 'string') {
        momappoki.util.logMessage(`validator.js: data-validator for ${inputID} is not valid JSON`, 'error');
      }

      // we don't want to validate on hidden fields unless forced
      if (!force && ($el.hasClass('off') || $el.hasClass('hidden') || !$el.is(':visible'))) {
        return true;
      }

      if ((type === 'radio' || type === 'checkbox')) {
        isValid = this.options.inputValidators[type]($el);

        this.fieldData[inputID].errors = !isValid ? ['required'] : [];
      } else {
        const testResults = this.testValue(inputVal, _.reject([...validators, type], val => (val === null || typeof (val) === 'undefined')));

        isValid = testResults.valid;

        this.fieldData[inputID].errors = [...testResults.errors];
      }

      return isValid;
    }

    testValue (value, tests = []) {
      const validators = _.without(_.uniq(tests), 'text');
      const errors = validators.filter((testName) => {
        const testArgs = testName.split(':');
        const validationMethod = this.options.inputValidators[testArgs[0]];
        const validationArgs = testArgs[1] || '';

        return validationMethod && !validationMethod(value, ...validationArgs.split(','));
      });

      return {
        valid: !errors.length,
        errors
      };
    }

    resetErrorState ($el) {
      const $parent = this.getParent($el);
      const $errors = $parent.find(`.${errorMsgClass}`);

      if ($errors.length) {
        $errors.remove();
      }

      $parent.removeClass(errorContainerClass);
      this.fieldData[$el.attr('name')].errors = [];

      return this;
    }

    resetFormErrorState () {
      this.$inputs.each((i, el) => {
        this.resetErrorState($(el));
      });

      return this;
    }

    applyErrorClasses ($el) {
      this.getParent($el).addClass(errorContainerClass);

      return this;
    }

    wrapErrorsInTemplate (id, messages, templateName = 'errorTemplate') {
      messages = _.isArray(messages) ? messages : [messages];

      const {
        useErrorIcon,
        errorTemplateWithIcon
      } = this.options;
      const template = useErrorIcon ? errorTemplateWithIcon : this.options[templateName];

      return messages.map(message => _.template(template)({ id, message })).join('\n');
    }

    getFormErrorMessages (unique) {
      const messages = this.$inputs.toArray().reduce((msgList, el) => {
        return [...msgList, ...this.getInputErrorMessages($(el))];
      }, []);

      return unique ? _.uniq(messages) : messages;
    }

    getInputErrorMessages ($el) {
      const inputID = $el.attr('name');
      const valData = $el.data('validator') || {};
      const type = valData.type || $el.attr('type');
      const field = this.fieldData[inputID];

      return field.errors.slice(0, this.options.errorLimit).map((error) => {
        let message = field.errorMessages && field.errorMessages[error];

        if (typeof (message) === 'undefined') {
          if (this.options.errorMessages[error]) {
            message = this.options.errorMessages[error];
          } else if (this.options.errorMessages[type]) {
            message = this.options.errorMessages[type];
          } else {
            message = this.options.errorMessages.generic;
          }
        }

        return message;
      });
    }

    insertAxErrors () {
      const errorMessages = _.flatMap(this.$inputs.toArray(), (el) => {
        const $el = $(el);
        const inputID = $el.attr('name');
        const messages = this.getInputErrorMessages($el);

        return messages.length && this.wrapErrorsInTemplate(inputID, messages, 'axErrorTemplate');
      });

      if (errorMessages.length) {
        this.$axErrorContainer
          .html(errorMessages.join('\n'))
          .children()
          .eq(0)
          .focus();
      }
    }

    insertFormErrorsIntoDom (showMessages = true) {
      this.$inputs.each((i, el) => {
        this.insertErrorIntoDom($(el), showMessages);
      });
    }

    insertErrorIntoDom ($el, showMessages = true, errorMessage) {
      this.resetErrorState($el);

      const valid = this.validateSingleInput($el);
      const $parent = this.getParent($el);
      const inputID = `${$el.attr('name')}-error-msg`;
      const fieldName = $el.attr('name');


      if (!valid) {
        if (showMessages) {
          let messages = [];
          const $target = this.getErrorTarget($parent, fieldName);

          if (errorMessage) {
            messages = [errorMessage];
          } else {
            messages = this.getInputErrorMessages($el);
          }

          if ($target.length) {
            $target.append(this.wrapErrorsInTemplate(inputID, messages));
          } else {
            $parent.append(this.wrapErrorsInTemplate(inputID, messages));
          }
        }

        this.applyErrorClasses($el);
      }
    }
  }

  momappoki.utilities.validator = Validator;
  window.momappoki = momappoki;
})(momappoki, jQuery, _, window);
