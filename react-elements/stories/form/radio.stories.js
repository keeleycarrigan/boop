import React from 'react';
import { storiesOf } from '@storybook/react';
import { withDocs } from 'storybook-readme';

import Form from 'Form';
import {
  FormFieldSet,
} from 'Form/components/Form/styles';
import Radio from 'Form/components/Radio';
import RadioReadMe from 'Form/components/Radio/README.md';
import InputGroup from 'Form/components/InputGroup';

storiesOf('Form/Inputs', module)
  .add('Radio', withDocs(RadioReadMe, () => {
    return (
      <React.Fragment>
        <Form style={{ textAlign: 'left' }}>
          <FormFieldSet>
            <InputGroup field="radio-inputs">
              <Radio
                id="radio-1"
                label="Radio 1"
                style={{ marginRight: 10 }}
                value="Radio One"
              />
              <Radio
                id="radio-2"
                label="Radio 2"
                value="Radio Two"
              />
            </InputGroup>
          </FormFieldSet>
        </Form>
      </React.Fragment>
    )
  }));
