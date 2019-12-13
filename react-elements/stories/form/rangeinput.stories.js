import React from 'react';
import { storiesOf } from '@storybook/react';
import { withDocs } from 'storybook-readme';

import Form, { SubmitButton } from 'Form';
import {
  FormFieldSet,
  FormLabel,
} from 'Form/components/Form/styles';
import RangeInput from 'Form/components/RangeInput';
import RangeInputReadMe from 'Form/components/RangeInput/README.md';

import {
  Row,
  Column
} from 'styling/layout/grid';

storiesOf('Form/Inputs', module)
  .add('RangeInput', withDocs(RangeInputReadMe, () => {
    return (
      <React.Fragment>
        <Row
          as={Form}
          style={{ textAlign: 'left' }}
          onSubmitSuccess={(formVals) => console.log(formVals)}
        >
          <Column>
            <FormFieldSet>
              <FormLabel>Default</FormLabel>
              <RangeInput
                field="form-range-input-1"
                id="form-range-input-1"
              />
            </FormFieldSet>
          </Column>
          <Column>
            <FormFieldSet>
              <FormLabel>Mapped Values</FormLabel>
              <RangeInput
                field="form-range-input-2"
                id="form-range-input-2"
                initialValue="Second Value"
                step={50}
                rangeMap={{
                  '0': 'First Value',
                  '50': 'Second Value',
                  '100': 'Third Value',
                }}
              />
            </FormFieldSet>
          </Column>
          <Column>
            <FormFieldSet>
              <SubmitButton>Submit</SubmitButton>
            </FormFieldSet>
          </Column>
        </Row>
      </React.Fragment>
    )
  }));
