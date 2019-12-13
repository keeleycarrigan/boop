import { merge } from 'lodash';

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
    this.config = merge({}, defaultConfig, config);
    this.delegate = merge({}, defaultDelegate, delegate);
  }

  updateProps = ({ delegate, config }) => {
    this.config = merge({}, this.config, config);
    this.delegate = merge({}, this.delegate, delegate);
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