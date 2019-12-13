import React from 'react';
import { storiesOf } from '@storybook/react';
import { withDocs } from 'storybook-readme';

import Form from 'Form';
import {
  FormFieldSet,
  FormLabel,
} from 'Form/components/Form/styles';
import TextInput from 'Form/components/TextInput';
import TextInputReadMe from 'Form/components/TextInput/README.md';



storiesOf('Form/Inputs', module)
  .add('TextInput', withDocs(TextInputReadMe, () => {
    return (
      <React.Fragment>
        <Form style={{ textAlign: 'left' }}>
          <FormFieldSet>
            <FormLabel>Input Label</FormLabel>
            <TextInput
              field="form-input-1"
              id="form-input-1"
              validate
            />
          </FormFieldSet>
        </Form>
      </React.Fragment>
    )
  }));
