import React, {
  useState
} from 'react';
import { storiesOf } from '@storybook/react';
import { withDocs } from 'storybook-readme';

import ElementsTheme from 'style/ElementsTheme';
import Dialog from 'Dialog';

import {
  Row,
  Column
} from 'layout/grid';

function Example(props) {
  const [modalActive, setModalActive] = useState(false);

  return (
    <React.Fragment>
      <button onClick={() => setModalActive(true)}>click</button>
      <Dialog active={modalActive} />
    </React.Fragment>
  )
}

storiesOf('Dialog', module)
  .add('Default', () => (
    <ElementsTheme>
      <Row>
        <Column>
          <Example />
        </Column>
      </Row>
    </ElementsTheme>
  ));
