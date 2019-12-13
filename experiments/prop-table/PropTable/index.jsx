import React from 'react';
import {
  BasicTable,
  BasicTableBody,
  BasicTableCaption,
  BasicTableCell,
  BasicTableColHeader,
  BasicTableHead,
  BasicTableRow,
  BasicTableRowHeader,
  BasicTableScreenReaderText,
} from './styles';

const OptionalCellText = ({ shouldDisplayDefault, defaultText, children }) => {
  if (shouldDisplayDefault) {
    return <BasicTableScreenReaderText showOnMobile>{defaultText}</BasicTableScreenReaderText>
  }

  return children;
}


const PropTable = ({ propDefinitions }) => {
  const props = propDefinitions.map(
    ({ property, propType, required, description, defaultValue }) => {
      return (
        <BasicTableRow key={property}>
          <BasicTableRowHeader
            alignLeft
            data-title='Name:'
            headers='name-header'
          >
            {property}
          </BasicTableRowHeader>
          <BasicTableCell
            data-title='Type:'
            headers='type-header'
          >
            {propType.name}
          </BasicTableCell>
          <BasicTableCell
            data-title='Default:'
            headers='default-header'
          >
            <OptionalCellText
              shouldDisplayDefault={typeof (defaultValue) !== 'string' || defaultValue.trim() === ''}
              defaultText="No default value."
            >
              {defaultValue}
            </OptionalCellText>
          </BasicTableCell>
          <BasicTableCell
            data-title='Required:'
            headers='required-header'
          >
            <OptionalCellText
              shouldDisplayDefault={!required}
              defaultText="No"
            >
              Yes
            </OptionalCellText>
          </BasicTableCell>
          <BasicTableCell
            alignLeft
            data-title='Description:'
            headers='description-header'
          >
            <OptionalCellText
              shouldDisplayDefault={typeof (description) !== 'string' || description.trim() === ''}
              defaultText="No description."
            >
              {description}
            </OptionalCellText>
          </BasicTableCell>
        </BasicTableRow>
      );
    }
  );

  return (
    <BasicTable style={{ marginTop: 25 }}>
      <BasicTableCaption>Component Props Table</BasicTableCaption>
      <BasicTableHead>
        <tr>
          <BasicTableColHeader
            id='name-header'
            scope='col'
          >
            Name
          </BasicTableColHeader>
          <BasicTableColHeader
            id='type-header'
            scope='col'
          >
            type
          </BasicTableColHeader>
          <BasicTableColHeader
            id='default-header'
            scope='col'
          >
            default
          </BasicTableColHeader>
          <BasicTableColHeader
            id='required-header'
            scope='col'
          >
            required
          </BasicTableColHeader>
          <BasicTableColHeader
            id='description-header'
            scope='col'
          >
            description
          </BasicTableColHeader>
        </tr>
      </BasicTableHead>
      <BasicTableBody>{props}</BasicTableBody>
    </BasicTable>
  );
};

export default PropTable;