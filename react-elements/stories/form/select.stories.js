import React from 'react';
import { storiesOf } from '@storybook/react';
import { withDocs } from 'storybook-readme';

import Form, { SubmitButton } from 'Form';
import {
  FormFieldSet,
  FormLabel,
} from 'Form/components/Form/styles';
import Select from 'Form/components/Select';
import Option from 'Form/components/Option';

import TextInputReadMe from 'Form/components/TextInput/README.md';

storiesOf('Form/Inputs', module)
  .add('Select', withDocs(TextInputReadMe, () => {
    return (
      <React.Fragment>
        <Form style={{ textAlign: 'left' }}>
          <FormFieldSet>
            <FormLabel htmlFor="form-select-1">Select 1</FormLabel>
            <Select
              field="form-select-1"
              id="form-select-1"
              validate={{
                errorMsg: 'Pick something other than "1"',
                test: (val) => val !== '1',
              }}
              initialValue="2"
            >
              <Option value=""></Option>
              <Option value="1">One</Option>
              <Option value="2">Two</Option>
              <Option value="3">Three</Option>
            </Select>
          </FormFieldSet>
          <FormFieldSet>
            <FormLabel htmlFor="form-select-2">Select 2</FormLabel>
            <Select
              field="form-select-2"
              id="form-select-2"
              disabled
            >
              <Option value="1">One</Option>
              <Option value="2">Two</Option>
              <Option value="3">Three</Option>
            </Select>
          </FormFieldSet>
          <FormFieldSet>
            <SubmitButton>Submit</SubmitButton>
          </FormFieldSet>
        </Form>
      </React.Fragment>
    )
  }));
