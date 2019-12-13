import React from 'react';

import { RangeConsumer } from 'RangeSlider/Context';

const withRangeSliderContext = Component =>
  React.forwardRef((props, ref) => (
    <RangeConsumer>
      {context => <Component ref={ref} {...context} {...props} />}
    </RangeConsumer>
  ));

  export default withRangeSliderContext;
