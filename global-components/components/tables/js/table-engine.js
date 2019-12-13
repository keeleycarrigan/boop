((momappoki = {}, $, _, window) => {
  momappoki.components = momappoki.components || {};

  const LOG = _.get(momappoki, 'utilities.logMessage', $.noop);
  const $BODY = $('body');
  const COMPONENT = 'momappoki_table_engine';
  const FILTER_ATTR = '[data-table-filter]';
  const SORT_ATTR = '[data-table-sort]';
  const DEFAULTS = {
    bodySelector: 'tbody',
    defaultContent: '',
    data: {},
    size: '',
    stickyRow: null,
    rowTemplate: _.get(momappoki, 'templates.table.row'),
    template: _.get(momappoki, 'templates.table.base'),
    onInit: $.noop,
    onSort: $.noop,
    onFilter: $.noop,
    onUpdate: $.noop
  };

  function onInputFilter (e) {
    const debounceTimer = momappoki.utilities.convertKeyCode(e).isEnter ? 0 : 300;
    _.debounce(() => {
      const $input = $(e.currentTarget);
      const {
        tableId,
        tableHeaderId,
        tableFrom // This is to pass filtering on working or cached data.
      } = $input.data();
      const $table = $(`#${tableId}`);

      const inst = momappoki.components.TableEngine.getInstance($table);

      inst && inst.filterRows($input.val(), tableHeaderId, tableFrom).updateView();
    }, debounceTimer)();
  }
  function handleFilterInputs (e) {
    const $input = $(e.currentTarget);
    const action = e.type === 'focusin' ? 'on' : 'off';

    $input[action]('keydown.tableFilter', onInputFilter);
  }

  function onClickSort (e) {
    e.preventDefault();

    const $trigger = $(e.currentTarget);
    const {
      tableId,
      tableHeaderId,
      tableSort
    } = $trigger.data();
    const $table = $(`#${tableId}`);
    const sortMethod = `sort${tableSort.charAt(0).toUpperCase()}${tableSort.slice(1)}`;
    const nextSortAction = tableSort === 'ascending' ? 'descending' : 'ascending';
    const $sortBtns = $(`[data-table-id="${tableId}"]`).filter((idx, el) => $(el).is('[data-table-sort]'));
    const inst = momappoki.components.TableEngine.getInstance($table);

    if (inst) {
      inst[sortMethod](tableHeaderId).updateView();
      /**
        This basically removes all active sort classes from other sort buttons
        tied to the same table.
      **/
      $sortBtns.removeClass('sort-ascending-active sort-descending-active');
      $trigger
        .addClass(`sort-${tableSort}-active`)
        .attr('data-table-sort', nextSortAction)
        .data('table-sort', nextSortAction);
    }
  }

  (function initTableActions () {
    if ($(SORT_ATTR).length) {
      $BODY.on('click.tableSort', SORT_ATTR, onClickSort);
    }

    if ($(FILTER_ATTR).length) {
      $BODY.on('blur.tableFilter focus.tableFilter', FILTER_ATTR, handleFilterInputs);
    }
  })();

  /**
    {
      attrs: {},
      caption: null,
      modifiers: '', (class name)
      head: {
        attrs: {},
        modifiers: '', (class name)
        rows: [
          {
            attrs: {},
            modifiers: '', (class name)
            cells: [
              {
                attrs: {},
                type: 'th', ('td')'
                id: 'whatever',
                content: html markup,
                modifiers: '', (class name)
              }
            ]
          }
        ]
      },
      body: {
        attrs: {},
        modifiers: '', (class name)
        rows: [
          {
            attrs: {},
            modifiers: '', (class name)
            cells: [
              {
                attrs: {},
                type: 'th', ('td')'
                id: 'whatever', // optional for td
                dataTitle: '',
                sortData: null, //optional can be used for complex content sorting
                content: html markup,
                headers: 'some-id another-id', (space separated list of related header ids)
                modifiers: '', (class name)
              }
            ]
          }
        ]
      }
    }
  **/

  momappoki.components.TableEngine = class TableEngine {
    constructor ($el, options = {}) {
      if (!(this instanceof TableEngine)) { return new TableEngine($el, options); }

      let inst = null;

      if ($el && $el instanceof jQuery && $el.length) {
        inst = $.data($el[0], COMPONENT);

        if (!inst) {
          inst = $.data($el[0], COMPONENT, this);

          this._init($el, options);
        }
      } else {
        let possibleOpts = {};

        if ($el && !($el instanceof jQuery)) {
          possibleOpts = $el;
        }

        this._preInit($.extend({}, possibleOpts, options));

        inst = this;
      }

      return inst;
    }

    static getInstance ($el) {
      let inst = null;

      if ($el && $el instanceof jQuery && $el.length) {
        inst = $.data($el[0], COMPONENT);
      }

      return inst;
    }

    _preInit (options = {}) {
      this.options = $.extend(true, {}, DEFAULTS, options);
      this.tableHTML = this.options.defaultContent;
      this.cachedData = this.sortStickyRow(this.options.data || {});
      this.workingData = this.sortStickyRow(this.options.data || {});

      if (!this.workingData || _.isEmpty(this.workingData)) {
        LOG('table-engine.js:%cNo data passed to Table Engine', 'color:red');
      }
    }

    _postInit ($el) {
      if ($el && $el instanceof jQuery && $el.length) {
        this.$el = $el;

        this._setTemplates();
        this.updateView();
        this.$el.attr('data-table-initialized', true);

        $BODY.trigger('momappoki.table-initialized', this);
        this.options.onInit(this);
      } else {
        LOG('table-engine.js:%cTable Engine needs a jQuery element to complete initialization.', 'color:red');
      }
    }

    _init ($el, options) {
      const dataOpts = $el.data('table-opts') || {};

      this._preInit($.extend(true, {}, options, dataOpts));
      this._postInit($el);
    }

    replaceData (data = {}, replaceCache) {
      if (replaceCache || _.isEmpty(this.cachedData)) {
        this.cachedData = this.sortStickyRow(data);
      }

      this.workingData = this.sortStickyRow(data);

      return this;
    }

    _setTemplates () {
      const needsTableWrap = !this.$el.is('table');

      if (!needsTableWrap) {
        this.$el
          .attr(this.workingData.attrs || {})
          .addClass(this.workingData.modifiers || []);
      }

      if (typeof (this.options.template) === 'function') {
        this.baseTemplate = this.options.template(this.options.size, needsTableWrap);
      } else {
        LOG('table-engine.js:%cTable template can\'t be found or isn\'t a function!', 'color:red');
      }

      if (typeof (this.options.rowTemplate) === 'function') {
        this.rowTemplate = this.options.rowTemplate(this.options.size);
      } else {
        LOG('table-engine.js:%cTable row template can\'t be found or isn\'t a function!', 'color:red');
      }
    }

    setElement ($el) {
      if ($el && $el instanceof jQuery && $el.length) {
        $.data($el[0], COMPONENT, this);

        this._postInit($el);
      }

      return this;
    }

    updateData (data = {}, updateCache) {
      if (updateCache || _.isEmpty(this.cachedData)) {
        this.cachedData = this.sortStickyRow(_.merge({}, this.cachedData, data));
      }

      this.workingData = this.sortStickyRow(_.merge({}, this.workingData, data));

      return this;
    }

    updateBodyRows (rows = [], updateCache) {
      const rowUpdate = { body: { rows } };

      if (updateCache || _.isEmpty(this.cachedData)) {
        this.cachedData = this.sortStickyRow(_.merge({}, this.cachedData, rowUpdate));
      }

      this.workingData = this.sortStickyRow(_.merge({}, this.workingData, rowUpdate));

      return this;
    }

    replaceBodyRows (rows = [], updateCache) {
      const newData = {
        ...this.workingData,
        body: {
          ...this.workingData.body,
          rows
        }
      };

      this.replaceData(this.sortStickyRow(newData), updateCache);

      return this;
    }

    resetTable () {
      this.replaceData(this.sortStickyRow(this.cachedData));
      return this.updateView();
    }

    updateView () {
      if (!_.isEmpty(this.workingData) && this.baseTemplate) {
        this.tableHTML = this.baseTemplate(this.workingData);
        this.$tableHTML = $(this.tableHTML);
      }

      this.$el.html(this.tableHTML);

      $BODY.trigger('momappoki.table-updated', this);
      this.options.onUpdate(this);

      return this;
    }

    updateViewRows () {
      if (!_.isEmpty(this.workingData) && this.rowTemplate) {
        const rowData = _.get(this.workingData, 'body.rows', []);
        this.rowHTML = rowData.map(row => this.rowTemplate(row)).join('\n');
        this.$bodyHTML = this.$el.find(this.options.bodySelector);
      }

      this.$bodyHTML.html(this.rowHTML);

      $BODY.trigger('momappoki.table-updated', this);
      this.options.onUpdate(this);

      return this;
    }

    sortStickyRow (data = {}) {
      const { stickyRow } = this.options;
      const rows = _.get(data, 'body.rows', []);
      const sortedRows = _.sortBy(rows, row => ((stickyRow && row.id === stickyRow) ? 0 : 1));

      return {
        ...data,
        body: {
          rows: sortedRows
        }
      };
    }

    _getCellByHeader (id, row) {
      return _.find(row.cells, cell => cell.headers.indexOf(id) > -1);
    }

    _getTextFromHTML (content) {
      const $content = $(content.replace(/\$|%/g, ''));
      let text = content;

      if ($content.length) {
        // This accounts for HTML set as content.
        text = $content.text();
      }

      return text;
    }

    _getCellSortVal (cell) {
      let sortVal = null;

      if (cell) {
        const {
          sortData,
          content
        } = cell;
        // jQuery doesn't like '$' or '%' in selectors.
        const textInHTML = this._getTextFromHTML(content);
        sortVal = this._parseCellContent(content);

        if (sortData) {
          sortVal = sortData;
        } else if (textInHTML) {
          // This accounts for HTML set as content.
          sortVal = this._parseCellContent(textInHTML);
        }
      }

      return sortVal;
    }

    _parseCellContent (content) {
      let parsed = content;

      if (typeof (content) === 'string') {
        const numbers = content.match(/[0-9]+([,.][0-9]+)?/g);

        if (numbers && numbers.length) {
          parsed = parseFloat(numbers[0], 10);
        }
      } else {
        parsed = parsed.toString();
      }

      return parsed;
    }

    _filterMatchesCell (headerID, terms, cell) {
      // If no "headerID" passed it "matches" because it's not a factor.
      const headerMatches = headerID ? cell.headers.indexOf(headerID) > -1 : true;

      return headerMatches && terms.some(term => this._getTextFromHTML(cell.content).toLowerCase().indexOf(term) > -1);
    }

    filterRows (term, headerID, fromData = 'cachedData') {
      /**
        Changing 'fromData' will allow you to filter on the 'cachedData' or 'workingData'
      **/
      const termList = _.isArray(term) ? term : [term];
      const bodyRows = _.get(this[fromData], 'body.rows', []);
      const filterTerms = termList.map(item => item.toString().toLowerCase());
      const rows = bodyRows.filter(row => row.cells.some(this._filterMatchesCell.bind(this, headerID, filterTerms)));

      this.replaceBodyRows(rows);

      $BODY.trigger('momappoki.table-filtered', this);
      this.options.onFilter(this);

      return this;
    }

    sort (id, sortTest = () => {}, callback = () => {}) {
      const bodyRows = _.get(this.workingData, 'body.rows', []);
      // If 'header' isn't passed in use the first header ID
      const sortID = id || _.get(this.workingData, 'head.rows[0].cells[0].id');

      if (bodyRows.length && sortID) {
        const rows = bodyRows.sort((rowA, rowB) => {
          const cellA = this._getCellByHeader(sortID, rowA);
          const cellB = this._getCellByHeader(sortID, rowB);
          const sortValA = this._getCellSortVal(cellA).toString();
          const sortValB = this._getCellSortVal(cellB).toString();

          return sortTest(sortValA, sortValB) || 0;
        });

        this.workingData = this.sortStickyRow(_.merge({}, this.workingData, { body: { rows } }));

        callback();
      }

      return this;
    }

    sortAscending (header) {
      return this.sort(header, (sortValA, sortValB) => sortValA.localeCompare(sortValB),
        () => {
          $BODY.trigger('momappoki.table-sorted', [this, 'ascending']);
          this.options.onSort(this, 'ascending');
        });
    }

    sortDescending (header) {
      return this.sort(header, (sortValA, sortValB) => -(sortValA.localeCompare(sortValB)),
        () => {
          $BODY.trigger('momappoki.table-sorted', [this, 'descending']);
          this.options.onSort(this, 'descending');
        });
    }
  };

  window.momappoki = momappoki;
})(window.momappoki, jQuery, _, window);
