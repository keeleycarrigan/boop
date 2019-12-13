import React from 'react';
import { storiesOf } from '@storybook/react';
import { withDocs } from 'storybook-readme';

import Form, { SubmitButton } from 'Form';
import {
  FormFieldSet,
  FormLabel,
} from 'Form/components/Form/styles';
import { GroupCheckbox } from 'Form/components/Checkbox';
import InputGroup from 'Form/components/InputGroup';
import InputGroupReadMe from 'Form/components/InputGroup/README.md';

storiesOf('Form/Inputs', module)
  .add('Input Group', withDocs(InputGroupReadMe, () => {
    return (
      <React.Fragment>
        <Form style={{ textAlign: 'left' }}>
          <FormFieldSet>
            <FormLabel>Multiselect Checkbox</FormLabel>
            <InputGroup field="checkbox-multiple">
              <GroupCheckbox
                id="checkbox-multiple-1"
                label="Choice 1"
                style={{ marginRight: 10 }}
                value="choice-1"
              />
              <GroupCheckbox
                id="checkbox-multiple-2"
                label="Choice 2"
                value="choice-2"
              />
            </InputGroup>
          </FormFieldSet>
          <FormFieldSet>
            <FormLabel>Single Choice Checkbox</FormLabel>
            <InputGroup
              field="checkbox-single-choice"
              multiselect={false}
            >
              <GroupCheckbox
                id="checkbox-single-choice-1"
                label="Single Choice 1"
                style={{ marginRight: 10 }}
                value="single-choice-1"
              />
              <GroupCheckbox
                id="checkbox-single-choice-2"
                label="Single Choice 2"
                value="single-choice-2"
              />
            </InputGroup>
          </FormFieldSet>
          <FormFieldSet>
            <SubmitButton>Submit</SubmitButton>
          </FormFieldSet>
        </Form>
      </React.Fragment>
    )
  }));
