# Form Inputs

## Form Components
* Input-Counter ([doc](./docs/input-counter.md))
  * Used to track and announce the remaining characters in a textarea.
* Input-Mask ([doc](./docs/input-mask.md))
  * Masks a numeric input to allow it to be formatted per design requirements but still have access to the value.
* Input-Range ([doc](./docs/input-range.md))
  * Styled and functional range input to conform with style standards.
* Input-Stepper ([doc](./docs/input-stepper.md))
  * Works as an increment control for an input, when specific values are desired.

## Text Inputs

Input implementation is pretty basic. All normal text `input` types are supported and normalized across browsers. A `placeholder` attribute is supported, but generally not used.

#### Default Text Input

```html
<fieldset>
  <label for="input-1" class="basic-label">Input 1</label>
  <input type="text" class="basic-input" name="input-1" id="input-1">
</fieldset>
```

#### Disabled Text Input

```html
<fieldset>
  <label for="input-2" class="basic-label">Input 2</label>
  <input type="text" class="basic-input" name="input-2" id="input-2" disabled>
</fieldset>
```

#### Text Input With Action

Notice the spacing utilities used on the `input`. This is done to support multiple actions, and/or actions being toggled at different breakpoints.

```html
<fieldset>
  <label for="search" class="basic-label-alt lg-pad-b1">Search</label>
  <div class="basic-input-wrap">
    <input type="search" class="basic-input sm-pad-r8 lg-pad-r6" name="search" id="search">
    <div class="basic-input-actions-right">
      <button type="submit" class="basic-input-action"><i class="momacon-search" aria-hidden="true"></i></button>
    </div>
  </div>
</fieldset>
```

#### Label/Question Positioning

Here's an example of a question label with extra label text accompanying the input. One thing to note here is that not **everything** in a `.flex-row` needs to be in a column container. This is useful when you want an element to behave like a normal flex child with an auto width. This layout could still be achieved by wrapping the side label in corresponding columns, but the separation between the input and label would be the standard gutter width unless spacing utilities were applied.

```html
<fieldset>
  <label for="question" class="basic-label-alt lg-pad-b1">What is your estimated HOA payment?</label>
  <div class="flex-row align-items-center-sm-up">
    <div class="sm-col-4">
      <input type="text" name="question" id="question" class="basic-input">
    </div>
    <span class="basic-label">Per Year</span>
  </div>
</fieldset>
```

Horizontal labels have the "alt" style on non-mobile (large up) screens. Use flex utilities for horizontal alignment.

```html
<fieldset>
  <div class="flex-row align-items-center-sm-up">
    <div class="sm-col-12 lg-col-3 txt-right-lg">
      <label for="search" class="basic-label-alt inline">Search</label>
    </div>
    <div class="sm-col-12 lg-col-9">
      <div class="basic-input-wrap">
        <input type="search" class="basic-input" name="search" id="search">
        <div class="basic-input-actions-right">
          <button class="basic-input-action"><i class="momacon-search" aria-hidden="true"></i></button>
        </div>
      </div>
    </div>
  </div>
</fieldset>
```

## Checkbox & Radio Inputs

Checkboxes and radios get their visual design from the `.basic-control-txt` element. It is layered on top of the `input` so the `input` can still show it's natural focus indicator. It is absolutely necessary for the `label for` and `input id` be the same. Otherwise, the `input` won't be toggled when the user presses the `label`.

#### Radio
```html
<label for="question-answer-1" class="basic-control-label">
	<input type="radio" class="basic-radio-input" name="question" id="question-answer-1" value="yes">
	<span class="basic-control-txt">Yes</span>
</label>
```

#### Checkbox
```html
<label for="option-1" class="basic-control-label">
	<input type="checkbox" class="basic-checkbox-input" name="option" id="option-1" value="some option">
	<span class="basic-control-txt">Some Option</span>
</label>
```

#### Default Vertical Layout

```html
<fieldset>
  <legend class="basic-label-alt sm-pad-b1">Some Options</legend>
  <label for="question-answer-1" class="sm-margin-b2 basic-control-label">
    <input type="radio" class="basic-radio-input" name="question" id="question-answer-1" value="yes">
    <span class="basic-control-txt">Yes</span>
  </label>
  <label for="question-answer-2" class="basic-control-label">
    <input type="radio" class="basic-radio-input" name="question" id="question-answer-2" value="no">
    <span class="basic-control-txt">No</span>
  </label>
</fieldset>
```

#### Horizontal Layout

```html
<fieldset>
	<div class="flex align-items-sm-up">
		<legend class="basic-label-question sm-margin-r2">Some Questions</legend>
		<label for="question-answer-1" class="sm-margin-r2 basic-control-label">
		  <input type="radio" class="basic-radio-input" name="question" id="question-answer-1" value="yes">
		  <span class="basic-control-txt">Yes</span>
		</label>
		<label for="question-answer-2" class="basic-control-label">
		  <input type="radio" class="basic-radio-input" name="question" id="question-answer-2" value="no">
		  <span class="basic-control-txt">No</span>
		</label>
	</div>
</fieldset>
```

## Toggle Input

A "toggle input" is basically just a checkbox styled to look like the iOS slide toggle button. Normally it wouldn't have text that changes based on the toggled state, but it has support to do so.

#### Default Toggle

```html
<fieldset>
  <label for="toggle-id-1" class="basic-control-label">
    <input type="checkbox" class="basic-toggle-input" role="switch" name="toggle-name" id="toggle-id-1">
    <span class="basic-control-txt"></span>
  </label>
</fieldset>
```

#### State Text Toggle

```html
<fieldset>
  <label for="toggle-id-2" class="basic-control-label">
    <input type="checkbox" class="basic-toggle-input" role="switch" name="toggle-name" id="toggle-id-2">
    <span class="basic-control-txt">
      <span class="basic-toggle-off-txt">Off</span>
      <span class="basic-toggle-on-txt">On</span>
    </span>
  </label>
</fieldset>
```

## Select

Select inputs use a transparent native select element wrapped in a `div` that gives the `select` a visual design. Width should be controlled with the grid.

```html
<fieldset>
  <label for="some-select" class="basic-label">Some Select</label>
  <div class="basic-select">
    <select name="some-select" id="some-select">
      <option value="1">One</option>
      <option value="2">Two</option>
      <option value="3">Three</option>
    </select>
  </div>
</fieldset>
```

## Text Area

Pretty simple. Constrain the width using the grid and provide a height by using the `rows` attribute.

```html
<fieldset>
	<label for="some-textarea" class="basic-label">Some Textarea</label>
	<textarea name="some-textarea" placeholder="Write some stuff here" rows="5" id="some-textarea" class="basic-textarea"></textarea>
</fieldset>
```

#### Text Area with Text Counter

The important parts here are making sure you have the right data attributes and hooking up the `aria-describedby` with the right `id`. A `maxlength` on the `textarea` and an `id` that matches a `data-input-counter-status` value on the  element containing the visual counter are both required. The visual status must have an `id` that matches the `aria-describedby` on the `textarea`. `data-input-counter` **IS NOT** required, but is useful for hooking into the global component initialization.

```html
<fieldset>
	<label for="some-text-counter" class="basic-label">Keeping Track of Your Text</label>
	<textarea name="some-text-counter" placeholder="We're watching you." aria-describedby="chars-remaining" rows="5" maxlength="150" id="some-text-counter" class="basic-textarea" data-input-counter></textarea>
	<p class="basic-label flex justify-end-sm-up" id="chars-remaining" data-input-counter-status="some-text-counter" aria-label="0 out of 150 characters remaining"><span data-input-counter-total>0</span>/150 Characters</p>
</fieldset>
```

## Segemented Input Control

See [Segmented Control Documentation](../segmented-control#segmented-control-input).
