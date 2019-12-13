import _merge from 'lodash/merge';

const defaultDelegate = {
  update: () => {},
  validate: () => true,
}

const defaultConfig = {
  maskOnChange: false,
  notify: [],
}

export default class FieldController {
  constructor({ api, config, delegate, field, node }) {
    this.api = api;
    this.field = field;
    this.node = node;
    this.config = _merge({}, defaultConfig, config);
    this.delegate = _merge({}, defaultDelegate, delegate);
  }

  updateProps = ({ delegate, config }) => {
    this.config = _merge({}, this.config, config);
    this.delegate = _merge({}, this.delegate, delegate);
  }

  validate(val, allVals) {
    const fieldErrors = this.delegate.validate.reduce((errorList, validation) => {
      if (!validation.test(val, allVals)) {
        errorList = [ ...errorList, validation.errorMsg ];
      }

      return errorList;
    }, []);
    const { errorLimit } = this.config;

    return errorLimit ? fieldErrors.slice(0, errorLimit) : fieldErrors;
  }
}