import React from 'react';
import { storiesOf } from '@storybook/react';
import { withDocs } from 'storybook-readme';

import Form, { SubmitButton } from 'Form';
import {
  FormFieldSet,
  FormLabel,
} from 'Form/components/Form/styles';
import TextInput from 'Form/components/TextInput';
import FormReadMe from 'Form/components/Form/README.md';

import {
  Row,
  Column
} from 'styling/layout/grid';

function onSubmit(values, errors, formState) {
  console.log('form values = ', values);
  console.log('form errors = ', errors);
  console.log('form state = ', formState);
}

storiesOf('Form', module)
  .add('Basic', withDocs(FormReadMe, () => (
    <Row justify={{ small: 'space-between', large: 'flex-end' }}>
        <Column cols={{ medium: 6 }} offsetCols={{ medium: 3, large: 0 }}>
          <Form
            style={{ textAlign: 'left' }}
            onSubmit={onSubmit}
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
          </Form>
        </Column>
      </Row>
    )
  ));
