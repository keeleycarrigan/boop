import {
    forEach,
    get,
    has,
    isArray,
    isEmpty,
    isPlainObject,
    merge,
    omit,
    reduce,
    set,
} from 'lodash';

import {
    deepRemoveEmpty
} from '../../../utilities';
import { hasInput } from '../utilities/validation';


function getAllErrors(obj) {
    return reduce(obj, (allErrors, error) => {
        if (isPlainObject(error) || isArray(error)) {
            allErrors = [...allErrors, ...getAllErrors(error)];
        } else {
            allErrors = [...allErrors, error];
        }

        return allErrors;
    }, []);
}

const defaultHandlers = {
    getApi: () => {},
    onPreSubmit: ({
        values
    }) => values,
    onSubmitSuccess: () => {},
    onSubmitFailure: () => {},
}

export default class FormController {
    constructor(handlers = {}, config = {}) {
        this.state = {
            errors: {},
            touched: {},
            values: config.initialValues || {},
        };

        this.config = config;
        this.handlers = merge({}, defaultHandlers, handlers);
        this.fields = {};
        this.fieldList = [];
        this.api = {
            addField: this.addField,
            getA11yErrorNodes: this.getA11yErrorNodes,
            getError: this.getError,
            getErrors: this.getErrors,
            getFormState: this.formState,
            getTouched: this.getTouched,
            getValue: this.getValue,
            removeError: this.removeError,
            removeField: this.removeField,
            setError: this.setError,
            setErrors: this.setErrors,
            setTouched: this.setTouched,
            setValue: this.setValue,
            setValues: this.setValues,
            submitForm: this.submitForm,
        };

        this.handlers.getApi(this.api);
    }

    get formState() {
        return merge({}, this.state, {
            pristine: this.pristine,
            valid: this.valid,
        });
    }

    get valid() {
        return isEmpty(this.state.errors);
    }

    get pristine() {
        return isEmpty(this.state.touched) && isEmpty(this.state.values);
    }

    getValue = (field) => {
        return get(this.state.values, field);
    }

    getTouched = (field) => {
        return get(this.state.touched, field);
    };

    getError = (field) => {
        return get(this.state.errors, field);
    };

    getA11yErrorNodes = () => {
        return this.fieldList.reduce((errors, field) => {
            const errorMsg = this.getError(field);
            const {
                node
            } = this.fields[field];

            if (errorMsg && node) {
                errors = [...errors, {
                    errorMsg: errorMsg.join('\n'),
                    node
                }];
            }

            return errors;
        }, []);
    }

    getErrors = () => {
        return getAllErrors(this.state.errors);
    }

    maskField(val, fieldCtrl) {
        const mask = get(fieldCtrl, 'config.mask', (rawVal) => rawVal);
        return mask(val);
    }

    setValue = (field, val, notify = false) => {
        const fieldCtrl = this.fields[field];
        const {
            maskOnChange
        } = fieldCtrl.config;
        const maskedVal = maskOnChange ? this.maskField(val, fieldCtrl) : val;
        const cleanedVal = hasInput(maskedVal) ? maskedVal : undefined;

        set(this.state.values, field, cleanedVal);
        
        // Remove the key from 'values' if there's no value.
        if (!cleanedVal) {
            this.state.values = deepRemoveEmpty(this.state.values);
        }

        fieldCtrl.delegate.update();
        notify && this.notifyConnectedFields(fieldCtrl.config.notify);
    }

    setValues = (values = {}, notify = true) => {
        forEach(values, (val, key) => {
            this.setValue(key, val, notify);
        });
    }

    setError = (field, errorMsg, notify) => {
        const fieldCtrl = this.fields[field];

        set(this.state.errors, field, errorMsg);
        fieldCtrl.delegate.update();
        notify && this.notifyConnectedFields(fieldCtrl.config.notify);
    };

    setErrors = (errors = {}, notify = true) => {
        forEach(errors, (val, key) => {
            this.setError(key, val, notify);
        });
    }

    removeError = (field, notify) => {
        const fieldCtrl = this.fields[field];

        this.state.errors = deepRemoveEmpty(omit(this.state.errors, [field]));
        fieldCtrl.delegate.update();
        notify && this.notifyConnectedFields(fieldCtrl.config.notify);
    }

    setTouched = (field, value = true) => {
        // Get the field controller to trigger any lifecycle methods
        const fieldCtrl = this.fields[field];
        const {
            mask,
            maskOnChange,
        } = fieldCtrl.config;
        let syncError = false;
        // Set touched
        set(this.state.touched, field, value);
        if (mask && !maskOnChange) {
            const fieldVal = get(this.state.values, field);

            set(this.state.values, field, this.maskField(fieldVal, fieldCtrl));
            this.state.values = deepRemoveEmpty(omit(this.state.values, [field]));
        }
        fieldCtrl.delegate.update();
        // Validate if on blur validation prop was set
        if (fieldCtrl.config.validateOnBlur || fieldCtrl.config.asyncValidateOnBlur) {
            syncError = this.validateField(field, fieldCtrl);
        }
        // Validate if on async touch validation prop was set,
        // but don't if there is a synchronus validation error.
        if (!syncError && fieldCtrl.config.asyncValidateOnBlur) {
            this.validateAsync(field, fieldCtrl);
        }
    };

    addField = (field, fieldCtrl) => {
        const {
            initialValue
        } = fieldCtrl.config;

        this.fields[field] = fieldCtrl;
        this.fieldList.push(field);

        if (initialValue) {
            this.state.values[field] = initialValue;
        }
    }

    removeField = (field) => {
        const fieldIdx = this.fieldList.indexOf(field);
        this.state = {
            errors: deepRemoveEmpty(omit(this.state.errors, [field])),
            touched: deepRemoveEmpty(omit(this.state.touched, [field])),
            values: deepRemoveEmpty(omit(this.state.values, [field])),
        };
        if (fieldIdx > -1) {
            this.fieldList.splice(fieldIdx, 1);
        }
    }

    handleValidationResponse(failedTests, field, notify) {
        const hasError = failedTests.length > 0;
        const existingError = has(this.state.errors, field);
        const {
            errorLimit
        } = this.config;
        const limitedTests = errorLimit ? failedTests.slice(0, errorLimit) : failedTests;

        if (hasError) {
            this.setError(field, limitedTests, notify);
        } else if (!hasError && existingError) {
            this.removeError(field, notify);
        }

        return hasError;
    }

    validateField = (field, fieldCtrl, notify = true) => {
        const fieldVal = this.getValue(field);
        const failedTests = fieldCtrl.validate(fieldVal, this.state.values);

        return this.handleValidationResponse(failedTests, field, notify);
    }

    validateAsync = (field, fieldCtrl, notify = true) => {
        return new Promise((resolve, reject) => {
            fieldCtrl.delegate.asyncValidate(get(this.state.values, field), this.state.values)
                .then(failedTests => {
                    // The expectation is that an "asycValidate" function will
                    // return an array. It should parse any responses from the
                    // outside service and return the array of error messages or
                    // an empty array.
                    if (!isArray(failedTests)) {
                        throw new Error(`The response from the asynchronus validation of ${field} must be an Array.`);
                    }
                    this.handleValidationResponse(failedTests, field, notify);
                    resolve();
                }).catch(() => {
                    // Just setting an error on this field to prevent submission
                    // if the field can't be validated. Also we don't notify other
                    // fields because the field could be valid. We just can't verify
                    // from the service validating it.

                    this.setError(field, ['Request Error'], notify);
                    resolve();
                });
        });
    }

    notifyConnectedFields(fields = []) {
        fields.forEach(field => {
            const fieldCtrl = this.fields[field];

            if (fieldCtrl) {
                // Continually notifying other fields on validation can
                // create a feedback loop if fields contain eachother in
                // their respective "notify" lists. This way there's just
                // one notification.
                this.validateField(field, fieldCtrl, false);
            } else {
                throw new Error(`Cant notify field ${field} as it does not exist.`);
            }
        })
    }

    submitForm = (e) => {
        if (e && !this.config.dontPreventDefault) {
            e.preventDefault();
        }

        const asyncValidators = this.fieldList.reduce((validators, field) => {
            const fieldCtrl = this.fields[field];
            let syncError = false;

            if (fieldCtrl.delegate.validate.length) {
                syncError = this.validateField(field, fieldCtrl, false);
            }

            if (!syncError && typeof (fieldCtrl.delegate.asyncValidate) === 'function') {
                validators = [...validators, this.validateAsync(field, fieldCtrl)];
            }

            return validators;
        }, []);

        Promise.all(asyncValidators)
            .then(() => {
                if (this.valid) {
                    const sendValues = this.handlers.onPreSubmit(this.state, this.api);

                    this.handlers.onSubmitSuccess(sendValues, this.api);
                } else {
                    this.handlers.onSubmitFailure(this.getErrors(), this.api);
                }
                console.log(this.formState);
            })
            .catch(() => {
                this.handlers.onSubmitFailure(this.getErrors(), this.api);
            });
    }
}
