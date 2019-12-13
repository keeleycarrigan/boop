import React from 'react';
import PropTypes from 'prop-types';

import { withGroup } from '../HOC/with';

export function asRadio (Component) {
    function DefaultRadio({ fieldApi, fieldState, groupApi, isGroup, ...props }) {
        const { value: groupValue } = fieldState;
        const {
            setValue,
            setTouched,
        } = fieldApi;
        const {
            onChange: groupOnChange,
            onBlur: groupOnBlur
        } = groupApi;
        const {
            field,
            forwardedRef,
            initialValue,
            multiselect, // unused by radios
            onBlur,
            onChange,
            value,
            ...rest
        } = props;

        const handleOnChange = (e) => {
            if (e.target.checked) {
                setValue(value);
                onChange(e);
                groupOnChange(e);
            }
        };
        const handleOnBlur = (e) => {
            setTouched();
            groupOnBlur(e);
            onBlur(e);
        };
        return (
            <Component
                {...rest}
                name={field}
                ref={forwardedRef}
                value={value}
                checked={groupValue === value}
                handleOnChange={handleOnChange}
                handleOnBlur={handleOnBlur}
                type="radio"
            />
        );
    };

    DefaultRadio.propTypes = {
        validate: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.bool,
            PropTypes.object,
        ]),
    }

    DefaultRadio.defaultProps = {
        onBlur: () => { },
        onChange: () => { },
        groupApi: {
            onBlur: () => { },
            onChange: () => { },
        },
    }

    return withGroup(DefaultRadio);
}

function BasicRadio({ handleOnChange, handleOnBlur, id, ...props }) {
    return (
        <input
            id={id}
            onBlur={handleOnBlur}
            onChange={handleOnChange}
            {...props}
        />
    );
};

export default asRadio(BasicRadio);