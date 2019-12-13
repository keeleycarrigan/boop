import React from 'react';
import { storiesOf } from '@storybook/react';
import { withDocs } from 'storybook-readme';

import Form from 'Form';
import {
  FormFieldSet,
  FormLabel,
} from 'Form/components/Form/styles';
import Checkbox from 'Form/components/Checkbox';
import CheckboxReadMe from 'Form/components/Checkbox/README.md';

storiesOf('Form/Inputs', module)
  .add('Checkbox', withDocs(CheckboxReadMe, () => {
    return (
      <React.Fragment>
        <Form style={{ textAlign: 'left' }}>
          <FormFieldSet>
            <Checkbox
              field="checkbox-1"
              id="checkbox-1"
              label="Checkbox 1"
            />
          </FormFieldSet>
        </Form>
      </React.Fragment>
    )
  }));
