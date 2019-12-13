import React from 'react';
import { storiesOf } from '@storybook/react';
import { withDocs } from 'storybook-readme';

import ElementsTheme from 'style/ElementsTheme';
import RangeSlider from 'RangeSlider';
import RangeSliderTrack from 'RangeSlider/components/RangeSliderTrack';
import RangeSliderMarker from 'RangeSlider/components/RangeSliderMarker';
import RangeSliderDoc from 'RangeSlider/README.md';
import {
  Row,
  Column
} from 'layout/grid';

import ControlledRange from './ControlledRange';

storiesOf('RangeSlider', module)
  .add('Default', withDocs(RangeSliderDoc, () => (
    <ElementsTheme>
      <Row>
        <Column>
          <RangeSlider>
            <RangeSliderTrack />
          </RangeSlider>
        </Column>
      </Row>
    </ElementsTheme>
  )))
  .add('Custom Steps', () => (
    <ElementsTheme>
      <Row>
        <Column>
          <RangeSlider step={5}>
            <RangeSliderTrack />
          </RangeSlider>
        </Column>
      </Row>
    </ElementsTheme>
  ))
  .add('Custom Steps w/ Markers', () => (
    <ElementsTheme>
      <Row>
        <Column paddingBottom={{ small: 50 }}>
          <RangeSlider min="40" max="300" step={65}>
            <RangeSliderTrack>
              <RangeSliderMarker at={40}>40</RangeSliderMarker>
              <RangeSliderMarker at={105}>105</RangeSliderMarker>
              <RangeSliderMarker at={170}>170</RangeSliderMarker>
              <RangeSliderMarker at={235}>235</RangeSliderMarker>
              <RangeSliderMarker at={300}>300</RangeSliderMarker>
            </RangeSliderTrack>
          </RangeSlider>
        </Column>
        <Column>
          <RangeSlider step={25}>
            <RangeSliderTrack>
              <RangeSliderMarker at={0}>0</RangeSliderMarker>
              <RangeSliderMarker at={25}>25</RangeSliderMarker>
              <RangeSliderMarker at={50}>50</RangeSliderMarker>
              <RangeSliderMarker at={75}>75</RangeSliderMarker>
              <RangeSliderMarker at={100}>100</RangeSliderMarker>
            </RangeSliderTrack>
          </RangeSlider>
        </Column>
      </Row>
    </ElementsTheme>
  ))
  .add('Controlled', () => (
    <Row>
      <Column>
        <ControlledRange />
      </Column>
    </Row>
  ));
