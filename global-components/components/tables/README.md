# Tables

Everyone loves tables. That's why we've tried to make them as simple as possible and provide tools that make it easy to generate dynamic tables as well as sorting and filtering those tables.

## Setup

### Normal Table

This type of table turns into "cards" on small/medium breakpoints. Used for tables with lots of data and/or columns. Can be used in combination with an accordion to break larger tables into small pieces.

```html
<table class="basic-table">
  <!-- If you want/need a caption -->
  <caption class="visuallyhidden">Your Table Caption</caption>
  <thead class="basic-table-head">
    <tr>
      <th id="col-1-header-name" scope="col" class="basic-table-col-header">Column One</th>
      <th id="col-2-header-name" scope="col" class="basic-table-col-header">Column Two</th>
      <th id="col-3-header-name" scope="col" class="basic-table-col-header">Column Three</th>
    </tr>
  </thead>
  <tbody class="basic-table-body">
    <tr class="basic-table-row">
      <!-- The first cell would only need an "id" if it's considered a row header. -->
      <th headers="col-1-header-name" id="row-header-name" class="basic-table-row-head" data-title="Column 1:">Lorum Ipsum</th>
      <!--
        The row header "id" would only be added to the "headers" attribute if there is a row header.
        "data-title" is required for all normal table cells. It's used for the mobile version
        of the table. "Small" tables don't require this since they are always tables.
      -->
      <td headers="col-2-header-name row-header-name" class="basic-table-cell" data-title="Column 2:">Lorum Ipsum</td>
      <td headers="col-3-header-name row-header-name" class="basic-table-cell" data-title="Column 3:">Lorum Ipsum</td>
    </tr>
  </tbody>
</table>
```

### Small Table

Layout is the same as the normal table except "small" is added to the normal table element classes. This type of table should have a small amount of data/columns as it visually stays a table through all breakpoints.

```html
<table class="basic-small-table">
  <thead class="basic-small-table-head">
    <tr>
      <th id="col-1-header-name" scope="col" class="basic-small-table-col-header">Column One</th>
      ...
    </tr>
  </thead>
  <tbody class="basic-small-table-body">
    <tr class="basic-small-table-row">
      <th headers="col-1-header-name" id="row-header-name" class="basic-small-table-row-head">Lorum Ipsum</th>
      ...
    </tr>
  </tbody>
</table>
```

## Dynamic Tables

Dynamic tables use our "Table Engine" component to build out table HTML from a data object. This component will also allow for row sorting and filtering. A dynamic table needs two main things to be initialized:

1. A container for it's injection point. This can be a `table` or just a container `div`. The component will figure how if it needs the `table` element wrapper or not based on the element type of the injection point.
2. Ideally, some data. Initial data isn't **required**, and if it's not the template will only be cached and not injected until the `updateView` method is called. **View the data structure [here](#dynamic-table-data-structure)**.

### Javascript Initialization

```js
const tableData = { ... };
/**
	It's good to have an instance of the table saved so methods can be called to update data,
	the view, or call custom sorting or filtering. Most methods return the instance so they
	can be chained.
**/
const myTable = new momappoki.components.TableEngine($('#dynamic-table'), { data: tableData });

/**
	Chained methods. Updating data won't automatically update the view until you
	tell it to update.
**/
myTable.updateData({ ... }).updateView();
```

It is possible to initialize a Table Engine instance without providing a container to initialize it on immediately. However, `setElement` must be called with a container to initialize the Table Engine on and data for the table before anything else can be done.

```js
const tableData = { ... };

// Options for initializing when setting an element later.

const preparedTable = new momappoki.components.TableEngine();

// or

const preparedTable = new momappoki.components.TableEngine(null, { data: tableData, options... });

// or

const preparedTable = new momappoki.components.TableEngine({ data: tableData, options... });

// If you chose the 1st option
preparedTable.updateData(tableData).setElement($('#some-element'));


// If you chose the 2nd or 3rd options
preparedTable.setElement($('#some-element'));
```

## Table Engine Options

##### defaultContent
This content will be injected into the initialized container until data for the table is applied and the view updated.

Type: `string/html`  
Default: `''`

##### data
The data used to build out the table. It doesn't have to be set on initialization. If it isn't use the `updateData` or `replaceData` methods. **View the data structure [here](#dynamic-table-data-structure)**.

Type: `object`  
Default: `null`

##### size
Specify the "size" of the table.

Type: `string`  
Default: `''`  
Options: `'small'`

##### stickyRow
This specifies the `id` of a row that will stick to the top of the table no matter what. This value must match an `id` key applied to a body row object.

Type: `string`  
Default: `null`


##### template
Specify a custom table template. This probably won't get used much, but it's an option. Any substitution should be a function that accepts the table size and if the `table` wrapper element should be included. Then it should return a function that accepts the table data and that function should return the generated html. This mimics the Lodash `_.template` method. The default template incorporates Lodash but it's not required that a substition do so as well.

Type: `function`  
Default: `_.get(momappoki, 'templates.table.base')`  

##### onInit
Called after initialization is finished. If the component is initialized without a container element this will be called after one is set. Alternatively, you can listen for `'momappoki.table-initialized'` on the `body`.

Type: `function`  
Default: `$.noop`  
Arguments: `this` (instance of Table Engine)  

##### onSort
Called after table data is sorted. Alternatively, you can listen for `'momappoki.table-sorted'` on the `body`.

Type: `function`  
Default: `$.noop`  
Arguments: `this` (instance of Table Engine), `'ascending'` or `'descending'` (sort type)  

##### onFilter
Called after table data is filtered. Alternatively, you can listen for `'momappoki.table-filtered'` on the `body`.

Type: `function`  
Default: `$.noop`  
Arguments: `this` (instance of Table Engine)  

##### onUpdate
Called after table view is updated. Alternatively, you can listen for `'momappoki.table-updated'` on the `body`.

Type: `function`  
Default: `$.noop`  
Arguments: `this` (instance of Table Engine)  



## Table Engine Methods

The Table Engine is built to be controlled by the developer. An instance of your table should be saved so it's methods can be run when necessary.

##### getInstance `static`
This static method can be used (without creating an instance) to get a Table Engine instance by passing in the container used to initialize the component.

Arguments: `jQuery Object`  
Returns: `null` or `object`

##### replaceData
Used to completely replace the `workingData` and/or `cachedData`. Passing `true` as the second argument will overwrite the cached table data as well.

Arguments: data: `Object`, replaceCache: `boolean`  
Returns: `this` (Table Engine Instance)

##### replaceBodyRows
Used to replace `workingData.body.rows
` and/or `cachedData.body.rows` with the data passed. Passing `true` as the second argument will update the cached table data as well. Usefeul if rows have different data, there is a different row order, or there are different number of rows. Rows are replaced with the ones passed in. If there is a sticky row this is factored in.

Arguments: data: `Array`, updateCache: `boolean`  
Returns: `this` (Table Engine Instance)

##### updateData
Used to update or merge the `workingData` and/or `cachedData` with the data passed. Passing `true` as the second argument will update the cached table data as well. If you are modifying existing rows use `replaceData` or `replaceBodyRows`. This update does a merge on the row array so passing rows that already exist will only add those rows.

##### updateBodyRows
Used to update or merge `workingData.body.rows
` and/or `cachedData.body.rows` with the data passed. Passing `true` as the second argument will update the cached table data as well. If you are modifying existing rows use `replaceData` or `replaceBodyRows`. This update does a merge on the row array so passing rows that already exist will only add those rows. Just pass an array of rows to merge in. If there is a sticky row this is factored in.

Arguments: data: `Array`, updateCache: `boolean`  
Returns: `this` (Table Engine Instance)

##### resetTable
Replaces the `workingData` with what's stored in `cachedData`, and then runs `updateView`. This resets the table to it's last cached state.

Returns: `this` (Table Engine Instance)

##### updateView
Runs a visual update based on the `workingData` by running the data through the table template and setting the initialized element's HTML.

Returns: `this` (Table Engine Instance)

##### filterRows
Will replace the current `cachedData` body rows based on the `term` & `headerID` passed. By default it will filter on the current set of `cachedData` but it can filter from `workingData` as well. `headerID` is the `id` of the column header you wish to filter on. If this isn't set all columns are available for comparison.

Arguments: term: `string`|`number`, headerID (optional): `string`, fromData (default: `cachedData`): `string`  
Returns: `this` (Table Engine Instance)

##### sortAscending
Used to sort body rows in an ascending order based on a single column. If `id` isn't passed the first column `id` is used.

Arguments: header: `string`  
Returns: `this` (Table Engine Instance)

##### sortDescending
Used to sort body rows in an descending order based on a single column. If `id` isn't passed the first column `id` is used.

Arguments: header: `string`  
Returns: `this` (Table Engine Instance)

##### sort
Used to sort body rows based on a comparsion of all rows in a single column. If `id` isn't passed the first column `id` is used. A custom sort function can be passed. This is what `sortAscending` and `sortDescending` use. Unless a custom sort is necessary the shortcut methods should be used.

Arguments: id: `string`, sortTest: `function`  
Returns: `this` (Table Engine Instance)

## Instance Values

These values are available from an instance of Table Engine.

* **$el** - jQuery element used to initialize the component on.  
* **options** - current options
* **tableHTML** - Current raw table HTML based on last `updateView`.  
* **$tableHTML** - jQuery wrapped version of `tableHTML`.  
* **cachedData** - copy of table data passed into component. May not reflect the current view. Can be updated and reset to.
* **workingData** - data object that reflects the current table view.
* **baseTemplate** - reference to cached table template function. If data is passed to this function new table HTML will be returned. Generally, this would only be used internally.

## Built-in Sort Button and Filter Inputs

Filtering and sorting rows can be accomplished with a custom implementation, but there are some automatic actions that can and should be used whenever possible.

### Sort Buttons

Sort buttons can really be anything clickable. Just apply a few data attributes.  

* Apply `data-table-sort` to the button/link.
* Set `data-table-sort` to either `"ascending"` or `"descending"`. When clicked the button will toggle from one to the other.
* Set `data-table-header-id` to the `id` of the column header you would like the button to sort. Or leave this off if you want the the sort to be based on the first column.
* Set `data-table-id` to the `id` of the element that was initialized by the Table Engine. This helps the component retrieve the instance of the table you're trying to sort. It makes it easy to have multiple tables and sorting buttons with only one listener that doesn't limit where you can place your sort buttons.

### Filter Inputs

A filter input is just a text input anywhere on the page that can be hooked up to a table. The `keydown` listener has a 300 milisecond debounce **unless** `enter` is pressed and then it's immediate.

* Apply `data-table-filter` to the `input`.
* Set `data-table-header-id` to the `id` of the column header you would like the button to sort. Or leave this off if you want the the sort to be based on the first column.
* Set `data-table-id` to the `id` of the element that was initialized by the Table Engine. This helps the component retrieve the instance of the table you're trying to sort. It makes it easy to have multiple tables and sorting buttons with only one listener that doesn't limit where you can place your sort buttons.


### Dynamic Table Data Structure

```js
{
  attrs: {},
  caption: null,
  modifiers: '', // space separated class names
  head: {
    attrs: {},
    modifiers: '', // space separated class names
    rows: [
      {
        attrs: {},
        modifiers: '', // space separated class names
        cells: [
          {
            attrs: {},
            type: 'th', // optional, default is ‘th’. ‘td’ should be set for extra row cells in t-head that are not headers
            id: 'whatever',
            content: ‘’, // html or just text
            modifiers: '', // space separated class names
          }
        ]
      }
    ]
  },
  body: {
    attrs: {},
    modifiers: '', // space separated class names
    rows: [
      {
        attrs: {},
        modifiers: '', // space separated class names
        cells: [
          {
            attrs: {},
            type: 'th', // optional, default is ‘td’. ‘th’ should be set for row header
            id: 'whatever', // optional for td
            dataTitle: '', // required for normal tables (not “small” tables), shown as cell title on mobile cards
            sortData: null, // optional can be used for complex content sorting
            content: ‘’, // html or just text,
            headers: 'some-id another-id', // space separated list of related header ids
            modifiers: '', // space separated class names
          }
        ]
      }
    ]
  }
}
```
