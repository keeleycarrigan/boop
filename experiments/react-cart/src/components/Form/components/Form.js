import React, {
    PureComponent,
} from 'react';

import FormController from '../controllers/FormController';
import {
    FormContext,
} from '../Context';
import {
    FormA11yErrorContainer,
    FormA11yErrorButton,
} from './styles';

export default class Form extends PureComponent {
    constructor(props) {
        super(props);

        const {
            dontPreventDefault,
            errorLimit,
            getApi,
            initialValues,
            onSubmit,
            onSubmitFailure,
            preSubmit,
        } = props;

        this.controller = new FormController({
            getApi,
            onSubmit,
            onSubmitFailure: (errorList, api) => {
                this.setState({
                    a11yErrors: api.getA11yErrorNodes(),
                    formErrors: errorList,
                }, () => {
                    // this.state.a11yErrors[0].node.current.focus();
                });
                onSubmitFailure(errorList, api);
            },
            preSubmit,
        },
        {
            dontPreventDefault,
            errorLimit,
            initialValues,
        });

        this.state = {
            formErrors: [],
            a11yErrors: [],
        }
    }

    get formContext() {
        return {
            controller: this.controller,
            formApi: this.controller.api,
            formErrors: this.state.formErrors,
            formState: this.controller.formState,
        };
    }

    get content() {
        const {
            children,
            component,
            render
        } = this.props;

        const props = this.formContext;

        if (component) {
            return React.createElement(component, props, children);
        }
        if (render) {
            return render(props);
        }
        if (typeof (children) === 'function') {
            return children(props);
        }
        return children;
    }

    renderA11yErrors(errors) {
        return errors.map((error, idx) => {
            const clickError = (e) => {
                e.preventDefault();
                node.current.focus();
                this.setState({
                    a11yErrors: []
                });
            }
            const {
                errorMsg,
                node
            } = error;
            return (
                <FormA11yErrorButton key={`error-${idx}`} type={'button'} onClick={clickError} >{errorMsg}</FormA11yErrorButton>
            );
        });
    }

    render() {
        const {
            children,
            component,
            dontPreventDefault,
            errorLimit,
            getApi,
            initialValues,
            onChange,
            onSubmitSuccess,
            onSubmitFailure,
            onValueChange,
            preSubmit,
            render,
            ...props,
        } = this.props;

        return (
            <FormContext.Provider value={this.formContext}>
                <FormA11yErrorContainer>{this.renderA11yErrors(this.state.a11yErrors)}</FormA11yErrorContainer>
                <form {...props}
                    onReset={this.formContext.formApi.reset}
                    onSubmit={this.formContext.formApi.submitForm}
                >
                    {this.content}
                </form>
            </FormContext.Provider>
        );
    }
}

Form.defaultProps = {
    onSubmitSuccess: () => {},
    onSubmitFailure: () => {},
}
