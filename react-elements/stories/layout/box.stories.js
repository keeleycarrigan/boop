import React from 'react';
import { storiesOf } from '@storybook/react';
import { withDocs } from 'storybook-readme';

import ElementsTheme from 'style/ElementsTheme';
import BoxReadMe from 'layout/Box/README.md';
import Box from 'layout/Box';
import {
  Row,
  Column
} from 'layout/grid';


storiesOf('Layout', module)
  .add('Box', withDocs(BoxReadMe, () => (
    <ElementsTheme>
      <Row
        justify={{ large: 'center' }}
        style={{ textAlign: 'left' }}
      >
        <Column marginY={{ small: 20, large: 40 }}>
          <Box
            bgColor="grayScaleBlack"
            color="grayScaleWhite"
            padding={{ small: 20 }}
          >
            <p>Hello</p>
          </Box>
        </Column>
        <Column
          cols={{ medium: 6, large: 4 }}
          marginBottom={{ smallOnly: 20 }}
        >
          <Box
            bgColor="grayScaleGray4"
            color="grayScaleWhite"
            padding={{ small: 10, large: 30 }}
            textAlign={{ small: 'right' }}
          >
            <p>Hello Right</p>
          </Box>
        </Column>
        <Column cols={{ medium: 6, large: 4 }}>
          <Box
            bgColor="grayScaleGray2"
            color="grayScaleWhite"
            padding={{ small: 10, large: 30 }}
            textAlign={{ medium: 'center' }}
            textSize={{ small: 30 }}
          >
            <p>Hello</p>
          </Box>
        </Column>
        <Column
          cols={{ large: 4 }}
          marginTop={{ mediumMax: 20 }}
        >
          <Box
            bgColor="grayScaleGray3"
            color="grayScaleWhite"
            padding={{ small: 30 }}
          >
            <p>Hello</p>
          </Box>
        </Column>
      </Row>
    </ElementsTheme>
  )
  ));
