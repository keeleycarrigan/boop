import React from 'react';
import { storiesOf } from '@storybook/react';
import { withReadme, withDocs } from 'storybook-readme';

import ElementsTheme from 'style/ElementsTheme';
import Form, { SubmitButton } from 'Form';
import {
  FormFieldSet,
  FormLabel,
} from 'Form/components/Form/styles';
import TextInput from 'Form/components/TextInput';
import GridReadMe from 'layout/grid/README.md';
import Box from 'layout/Box';
import {
  Row,
  Column
} from 'layout/grid';


storiesOf('Layout', module)
  .add('Grid', withDocs(GridReadMe, () => (
    <ElementsTheme>
      <Row
        justify={{ large: 'center' }}
        style={{ textAlign: 'left' }}
      >
        <Column
          as={Form}
          cols={{ medium: 9 }}
          offsetCols={{ medium: 3, large: 0 }}
        >
          <Row nest>
            <Column padding={{ medium: 6, large: 10 }}>
              <FormFieldSet>
                <FormLabel htmlFor="form-input-1">Input 1</FormLabel>
                <TextInput
                  field="form-input-1"
                  id="form-input-1"
                  validate
                />
              </FormFieldSet>
            </Column>
            <Column>
              <FormFieldSet>
                <FormLabel htmlFor="form-input-2">Input 2</FormLabel>
                <TextInput
                  field="form-input-2"
                  id="form-input-2"
                  disabled
                />
              </FormFieldSet>
            </Column>
            <Column>
              <FormFieldSet>
                <SubmitButton>Submit</SubmitButton>
              </FormFieldSet>
            </Column>
          </Row>
        </Column>
        <Column marginY={{ small: 20, large: 40 }}>
          <Box
            bgColor="grayScaleGray2"
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
            bgColor="grayScaleGray2"
            color="grayScaleWhite"
            padding={{ small: 10, large: 30 }}
          >
            <p>Hello</p>
          </Box>
        </Column>
        <Column cols={{ medium: 6, large: 4 }}>
          <Box
            bgColor="grayScaleGray2"
            color="grayScaleWhite"
            padding={{ small: 10, large: 30 }}
          >
            <p>Hello</p>
          </Box>
        </Column>
        <Column
          cols={{ large: 4 }}
          marginTop={{ mediumMax: 20 }}
        >
          <Box
            bgColor="grayScaleGray2"
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
