import React, { PureComponent } from 'react';

import RangeSlider from 'RangeSlider';
import RangeSliderTrack from 'RangeSlider/components/RangeSliderTrack';

class ControlledRange extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            rangeValue: 0
        }
    }

    onRangeChange = (rangeValue) => {
        this.setState({ rangeValue });
    }

    render() {
        return (
          <RangeSlider
            value={this.state.rangeValue}
            onChange={this.onRangeChange}
          >
            <RangeSliderTrack />
          </RangeSlider>
        );
    }
}

export default ControlledRange;
