(function init (momappoki = {}, _, window) {
  momappoki.templates = momappoki.templates || {};

  function formatAttrs (attrs = {}) {
    return _.map(attrs, (val, key) => `${key}="${val}"`).join(' ');
  }

  function getTableSize (size = 'default') {
    return size && size.trim() !== 'default' && size.trim() !== '' ? `-${size}-` : '-';
  }

  function tableBase (size = 'default', includeWrap = true) {
    const baseTemplate = `
      ${includeWrap && `<table class="basic${getTableSize(size)}table <%= data.modifiers %>" <%= momappoki.templates.utilities.formatAttrs(data.attrs) %>>`}
        <% data.caption && print('<caption class="basic-table-caption">' + data.caption + '</caption>') %>
        <% data.head && print(momappoki.templates.table.renderTableHeader("${size}", data.head)) %>
        <% if (data.body) { %>
          <tbody class="basic${getTableSize(size)}table-body <% print(_.get(data, 'body.modifiers', '')) %>" <%= momappoki.templates.utilities.formatAttrs(data.body.attrs) %>>
            <%= data.body.rows.map(momappoki.templates.table.renderTableRow.bind(null, "${size}")).join('') %>
          </tbody>
        <% } %>
      ${includeWrap && '</table>'}
    `;

    return _.template(baseTemplate, { variable: 'data' });
  }

  function tableHead (size = 'default') {
    const headTemplate = `
      <thead class="basic${getTableSize(size)}table-head <%= data.modifiers %>" <%= momappoki.templates.utilities.formatAttrs(data.attrs) %>>
        <%= data.rows.map(momappoki.templates.table.renderTableHeadRow.bind(null, "${size}")).join('') %>
      </thead>
    `;

    return _.template(headTemplate, { variable: 'data' });
  }

  function tableHeadRow (size = 'default') {
    const rowTemplate = `
      <tr class="<%= data.modifiers %>" <%= momappoki.templates.utilities.formatAttrs(data.attrs) %>>
        <%= data.cells.map(momappoki.templates.table.renderTableHeadCell.bind(null, "${size}")).join('') %>
      </tr>
    `;

    return _.template(rowTemplate, { variable: 'data' });
  }

  function tableRow (size = 'default') {
    const rowTemplate = `
      <tr class="basic${getTableSize(size)}table-row <%= data.modifiers %>" <%= momappoki.templates.utilities.formatAttrs(data.attrs) %>>
        <%= data.cells.map(momappoki.templates.table.renderTableCell.bind(null, "${size}")).join('') %>
      </tr>
    `;

    return _.template(rowTemplate, { variable: 'data' });
  }

  function tableCell (size = 'default', cellSuffix = 'cell') {
    const cellTemplate = `
      <% var tagType = data.type || 'td' %>
      <<%= tagType %> <% typeof(data.id) === 'string' ? print('id="' + data.id + '"') : '' %> class="basic${getTableSize(size)}table-${cellSuffix} <%= data.modifiers %>" <%= momappoki.templates.utilities.formatAttrs(data.attrs) %>>
        <%= data.content %>
      </<%= tagType %>>
    `;

    return _.template(cellTemplate, { variable: 'data' });
  }

  function renderTableHeader (size, header) {
    return tableHead(size)(header);
  }

  function renderTableHeadRow (size, row) {
    return tableHeadRow(size)(row);
  }

  function renderTableRow (size, row) {
    return tableRow(size)(row);
  }

  function renderTableHeadCell (size, cell) {
    const type = cell.type || 'th';

    return tableCell(size, type === 'th' ? 'col-header' : 'header-cell')(_.merge({}, cell, { type }));
  }

  function renderTableCell (size, cell) {
    const {
      headers,
      dataTitle
    } = cell;
    const attrs = {
      'data-title': dataTitle,
      headers
    };

    return tableCell(size, cell.type === 'th' ? 'row-head' : 'cell')(_.merge({}, cell, { attrs }));
  }

  momappoki.templates.table = {
    base: tableBase,
    head: tableHead,
    headRow: tableHeadRow,
    cell: tableCell,
    row: tableRow,
    formatAttrs,
    renderTableCell,
    renderTableHeadCell,
    renderTableRow,
    renderTableHeadRow,
    renderTableHeader
  };

  window.momappoki = momappoki;
})(window.momappoki, _, window);
