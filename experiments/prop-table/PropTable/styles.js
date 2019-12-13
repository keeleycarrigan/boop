import styled, { css } from 'styled-components';

import {
  modifiers,
  visuallyHidden,
} from '../../styles/utilities';
import queries from '../../styles/queries';


export const BasicTable = styled.table`
  border-collapse: collapse;
  border: 1px solid #CCC;
  display: block;
  position: relative;
  table-layout: fixed;
  width: 100%;

  ${queries.large`
    display: table;
  `}
`;

export const BasicTableCaption = styled.caption`
  ${visuallyHidden}
`;

export const BasicTableHead = styled.thead`
  border: none;
  border-bottom: 1px solid #CCC;
  color: #333;
  overflow: hidden;
  padding: 0;
  display: none;

  ${queries.large`
    display: table-header-group;
  `}
`;

export const BasicTableColHeader = styled.th`
  font-size: 11px;
  font-weight: bold;
  height: 30px;
  line-height: 1.25;
  padding: 10px 15px;
  text-transform: uppercase;

  &:last-child {
    border-right: none;
  }
`;

export const BasicTableBody = styled.tbody`
  display: block;

  ${queries.large`
    display: table-row-group;
  `}
`;

export const BasicTableRow = styled.tr`
  border: none;
  border-top: 1px solid #CCC;
  display: flex;
  flex-wrap: wrap;

  ${queries.large`
    border-top: none;
    display: table-row;

    &:nth-child(even) {
      background-color: #F1F1F1;
    }
  `}
`;

const baseTableCell = css`
  box-sizing: border-box;
  color: #333;
  display: block;
  font-size: 14px;
  font-weight: normal;
  line-height: 1.5;
  padding: 10px 15px;

  ${queries.large`
    display: table-cell;
    width: auto;
    text-align: center;

    ${modifiers('alignLeft')`
      text-align: left;
    `}
  `}

  &::before {
    color: currentColor;
    content: attr(data-title);
    display: block;
    font-size: 11px;
    font-weight: bold;
    line-height: 1.5;
    text-transform: uppercase;

    ${queries.large`
      content: none;
      display: none;
    `}
  }
`;

export const BasicTableCell = styled.td`
  ${baseTableCell}
  width: 50%;
`;

export const BasicTableRowHeader = styled.th`
  ${baseTableCell}
  background-color: #F1F1F1;
  text-align: left;
  width: 100%;

  &::before {
    display: inline-block;
    padding-right: 10px;
  }

  ${queries.large`
    background-color: transparent;
  `}
`;

export const BasicTableScreenReaderText = styled.span`
  ${visuallyHidden}
  display: inline-block;

  ${modifiers('showOnMobile')`
    ${queries.mediumMax`
      clip: auto;
      height: auto;
      margin: 0;
      overflow: visible;
      width: auto;
    `}
  `}
`;