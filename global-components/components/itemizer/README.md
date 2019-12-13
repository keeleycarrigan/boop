# Itemizer:
___

A component to connect a simple form to inputs or text fields, and allow fields to be added in an accessible way. This component is implemented with just a sum of the fields in mind. Additional math or other modifications will need to be coded on a more page specific level.

### Options:
######  customLimit: Number
  - Default - 5
  - Limit the number of additional custom fields per itemizer instance
  - Range should be 0 - 5 in order for aria to meet Ax requirements, exceeding 5 will cause issue with aria count.

######  fieldTemplate: template function
  - Sets up the row and columns that wrap the custom inputs
  - basicRow in the itemizer file can serve as an example, but should be copied and modified on an individual implementation basis. The variables accepted into this template are relied upon and should not be changed.

######  titleAria:
  - Default - 'Custom Title Field'
  - The aria for the titles inputs, is prepended with a count (ie. First, Second, Third)

######  valueAria:
  - Default - 'Custom Amount Field'
  - The aria for the amounts inputs, is prepended with a count (ie. First, Second, Third)

######  maskOpts:
  - The default options for input masks initialized through the itemizer.
  - Defaults:
    `{ decimals: 2, min: 0, prefix: '$', suffix: '' }`

### HTML Setup

#### Important data-attributes
###### `data-itemizer-action`:
  Identifies the interaction elements for the itemizer. The value determines what the interaction should be, and anything not on the short list is just treated as a submit.
  - Values: `add`, `clear`, `submit`

###### `data-itemizer-aria`:
  An empty, visually hidden, container for any text to be injected and announced to a screen-reading user. Suggested to also include `aria-live="polite"` on the container.

###### `data-itemizer-customs`:
  Identifies the container into which custom fields are injected.

###### `data-itemizer-field`:
 A data attribute that identifies all of the fields included in the SUM function that is called on submit or update. Allows for other arithmetic to occur outside of these fields that is still accounted into the final SUM.

###### `data-itemizer-message`:
 The copy text to display in place of the 'add field' button, this text will be implementation specific until a time where more form based standards are decided on.

###### `data-itemizer-preview`:
Indicates a preview container that is updated whenever an `itemizer-field`'s value is input.
Must have a value matching the `data-itemizer` value to ensure the correct itemizer is updating the preview.

###### `data-itemizer-target`:
The element or elements that will receive the SUM value from the itemizer form should all have this attribute. Text elements or inputs can be targeted freely, and multiple targets can exist per itemizer. This value needs to match the `data-itemizer` value that should be included on the form itself.

##### Sample Itemizer Targets
````HTML
<p data-itemizer-target="sample-itemizer-name"></p>

<input id="test" type="text" class="basic-input" name="need-itemized-sum" data-itemizer-target="sample-itemizer-name">
````


##### Form
````HTML
<h2 class="txt-size-7">College Costs Itemizer</h2>
<div class="row sm-margin-t8" data-itemizer="sample-itemizer-name">
  <form class="sm-center-col-8">
    <div class="row sm-margin-b3">
      <div class="sm-col-6">
        <label for="field-1">First Field</label>
      </div>
      <div class="sm-col-4 sm-offset-col-2">
        <input type="text" name="field-1" id="field-1" class="basic-input" data-itemizer-field value="0">
      </div>
    </div>
    <div class="row sm-margin-b3">
      <div class="sm-col-6">
        <label for="field-2">Second Field</label>
      </div>
      <div class="sm-col-4 sm-offset-col-2">
        <input type="text" name="field-2" id="field-2" class="basic-input" data-itemizer-field>
      </div>
    </div>
    <div class="row sm-margin-b3">
      <div class="sm-col-6">
        <label for="field-3">Third Field</label>
      </div>
      <div class="sm-col-4 sm-offset-col-2">
        <input type="text" name="field-3" id="field-3" class="basic-input" data-itemizer-field>
      </div>
    </div>
    <div class="visuallyhidden" aria-live="polite" data-itemizer-aria></div>
    <div class="" data-itemizer-customs>

    </div>
    <div class="row sm-margin-b3">
      <div class="sm-col-6">
        <button href="#" class="momappoki-btn txt-btn" data-itemizer-action="add" data-track-elem="link" data-track-name="AddItem" data-track-trigger="update" aria-label="Add additional item">Add Item <i class="icon-add sm-margin-l1" aria-hidden="true"></i></button>
        <p class="off" tabindex="-1" data-itemizer-message>You can only add five additional items</p>
      </div>
    </div>
    <div class="row">
      <div class="sm-col-6">
        <h2>Total <span data-itemizer-preview="sample-itemizer-name">$0</span></h2>
      </div>
      <div class="sm-col-12 lg-col-6">
        <div class="momappoki-btn-group">
          <button class="momappoki-btn expand-md-down" data-itemizer-action="submit" data-close-dialog="">Submit</button>
          <button class="momappoki-btn txt-btn-md expand-md-down secondary lg-margin-l2" data-itemizer-action="clear">Clear</button>
        </div>
      </div>
    </div>
  </form>
</div>
````
