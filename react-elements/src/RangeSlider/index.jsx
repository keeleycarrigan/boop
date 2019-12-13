import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _findKey from 'lodash/findKey';

import {
    RangeTrackControl,
    RangeTrackWrapper,
} from 'RangeSlider/styles';

import { RangeProvider } from 'RangeSlider/Context';

class RangeSlider extends PureComponent {
    constructor(props) {
        super(props);

        const {
            min,
            value,
        } = props;

        this.state = {
            internalValue: value || min,
        };
    }

    componentDidUpdate() {
        const {
            value,
        } = this.props;

        if (value !== null) {
            this.updateValue(value);
        }
    }

    get rangeContext() {
      const { max, min } = this.props;
      const { internalValue } = this.state;
      const range = ((internalValue - min)  * 100) / (max - min);

      return {
        max,
        min,
        range,
        value: internalValue,
      };
    }

    updateValue(value) {
        const {
            internalValue,
        } = this.state;
        const { rangeMap } = this.props;
        const mappedValue = _findKey(rangeMap, mapKey => mapKey === value) || value;
        const parsedValue = parseFloat(mappedValue, 10);

        if (internalValue !== parsedValue) {
            this.setState({ internalValue: parsedValue });
        }
    }

    onInputChange = (e) => {
        const {
            onChange,
            rangeMap,
            value,
        } = this.props;
        const parsedValue = parseFloat(e.target.value, 10);
        const mappedValue = rangeMap[parsedValue] || parsedValue;

        if (value === null) {
          this.updateValue(mappedValue);
        }

        onChange(mappedValue);
    }

    render() {
        const {
            children,
            className,
            onChange,
            value,
            ...rest
        } = this.props;
        const {
            internalValue,
        } = this.state;


        return (
          <RangeProvider value={this.rangeContext} >
            <RangeTrackWrapper className={className} >
              <RangeTrackControl
                value={internalValue}
                onChange={this.onInputChange}
                {...rest}
                type="range"
              />
              {children}
            </RangeTrackWrapper>
          </RangeProvider>
        );
    }
}

RangeSlider.defaultProps = {
    max: 100,
    min: 0,
    onChange: () => {},
    onMouseDown: () => {},
    onMouseUp: () => {},
    rangeMap: {},
    step: 'any',
    value: null,
};

RangeSlider.propTypes = {
    max: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    min: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    onChange: PropTypes.func,
    onMouseDown: PropTypes.func,
    onMouseUp: PropTypes.func,
    rangeMap: PropTypes.object,
    step: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default RangeSlider;
