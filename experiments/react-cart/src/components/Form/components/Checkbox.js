import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { withGroup } from '../HOC/with';
import asField from '../HOC/asField';

function getGroupMultiselectVal (currentFormVal = [], isChecked, inputVal) {
    return isChecked ? [...currentFormVal, inputVal] : currentFormVal.filter(val => val !== inputVal);
}

function getBasicCheckbox (Component) {
    class BasicCheckbox extends PureComponent {
        isChecked() {
            const { fieldState, multiselect, isGroup, value: inputVal } = this.props;
            const { value: formVal } = fieldState;
            if (isGroup) {
                if (multiselect) {
                    return formVal ? formVal.indexOf(inputVal) > -1 : false;
                } else {
                    return formVal === inputVal;
                }
            }

            return !!formVal;
        }

        handleOnChange = (e) => {
            const { fieldApi, fieldState, multiselect, groupApi, isGroup, value: inputVal, onChange, } = this.props;
            const { value: formVal } = fieldState;
            const isChecked = e.target.checked;
            let newVal;

            if (isGroup) {
                if (multiselect) {
                    newVal = getGroupMultiselectVal(formVal, isChecked, inputVal);
                } else if (isChecked && !multiselect) {
                    newVal = inputVal;
                }
            } else {
                newVal = isChecked;
            }
            fieldApi.setValue(newVal);
            onChange(e);
            groupApi.onChange(e);
        }

        handleOnBlur = (e) => {
            const {
                fieldApi,
                groupApi,
                onBlur,
            } = this.props;

            fieldApi.setTouched();
            onBlur(e);
            groupApi.onBlur(e);
        };

        render() {
            const { fieldApi, fieldState, groupApi, multiselect, isGroup, ...props } = this.props;
            const {
                field,
                forwardedRef,
                initialValue,
                onBlur,
                onChange,
                value: inputVal,
                ...rest
            } = props;

            return (
                <Component
                    {...rest}
                    checked={this.isChecked()}
                    name={field}
                    onBlur={this.handleOnBlur}
                    onChange={this.handleOnChange}
                    ref={forwardedRef}
                    type="checkbox"
                />
            );
        }
    }

    BasicCheckbox.propTypes = {
        validate: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.bool,
            PropTypes.object,
        ]),
    }

    BasicCheckbox.defaultProps = {
        onBlur: () => { },
        onChange: () => { },
        groupApi: {
            onBlur: () => { },
            onChange: () => { },
        },
    }

    return BasicCheckbox;
}

export function asCheckbox(Component) {
    return asField(getBasicCheckbox(Component));
}

export function asGroupCheckbox (Component) {
    return withGroup(getBasicCheckbox(Component));
}

const DefaultCheckbox = React.forwardRef((props, ref) => <input {...props} ref={ref} />);


export const GroupCheckbox  = asGroupCheckbox(DefaultCheckbox);

export default asCheckbox(DefaultCheckbox);