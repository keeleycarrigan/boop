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
    constructor(props) {
        this.updateProps(props)
    }

    updateProps = ({ field, node, api, delegate, config }) => {
        this.api = api;
        this.config = merge({}, defaultConfig, config);
        this.delegate = merge({}, defaultDelegate, delegate);
        this.field = field;
        this.node = node;
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