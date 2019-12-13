import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import asField from '../HOC/asField';

export class BasicSelect extends PureComponent {
    constructor(props) {
        super(props);

        this.selectRef = props.forwardedRef || React.createRef();
    }

    componentDidUpdate(prevProps) {
        if (this.props.forwardedRef !== prevProps.forwardedRef) {
            this.selectRef = this.props.forwardedRef;
        }
    }

    handleOnChange = (e) => {
        const {
            fieldApi,
            forwardedRef,
            multiple,
            onChange,
        } = this.props;
        const selected = [...this.selectRef.current]
            .filter(option => option.selected)
            .map(option => option.value);

        fieldApi.setValue(multiple ? selected : selected[0] || '');

        onChange(e);
    }

    handleOnBlur = (e) => {
        const {
            fieldApi,
            onBlur,
        } = this.props;

        fieldApi.setTouched();
        onBlur(e);
    }

    render() {
        const {
            fieldApi,
            fieldState,
            ...props
        } = this.props;
        const {
            errors,
            touched,
            value,
        } = fieldState;
        const {
            onChange,
            onBlur,
            field,
            initialValue,
            forwardedRef,
            children,
            multiple,
            ...rest
        } = props;
        const style = errors ? { border: '1px solid red' } : {};

        return (
            <div className={'basic-select'} style={style}>
                <select
                    {...rest}
                    multiple={multiple}
                    name={field}
                    ref={this.selectRef}
                    value={value || (multiple ? [] : '')}
                    onChange={this.handleOnChange}
                    onBlur={this.handleOnBlur}>
                    {children}
                </select>
            </div>
        );
    }
}

const Select = asField(BasicSelect);

Select.propTypes = {
    validate: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.bool,
        PropTypes.object,
    ]),
}

Select.defaultProps = {
    onBlur: () => { },
    onChange: () => { },
}

export default Select;