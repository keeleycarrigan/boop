# Input Counter
---

The input counter is used primarily with text areas, or other fields with large amount of text. This component shows text below the text area indicating the remaining available characters. 

---

## Initializing

This component is auto initialized with the bootstrap. Manual initialization is not recommended.

### Markup Structure
Below is the minimum markup required to bootstrap an input counter. 

The `[data-input-counter-status]` value must be the id of the text area it is associated with.

```html
<textarea class="basic-textarea" aria-describedby="shortPitch-error-msg" id="brief-desc" name="shortPitch" autocomplete="off" rows="5" maxlength="250" ></textarea>
<p class="basic-label" data-input-counter-status="brief-desc">
  <span class="visuallyhidden" data-input-counter-msg="polite"></span>
  <span class="visuallyhidden" data-input-counter-msg="assertive"></span>
  <span id="chars-remaining" class="visuallyhidden" data-input-counter-msg="description">250 out of 250 characters remaining</span>
  <span data-input-counter-total="">0</span>/250 CHARACTERS
</p>
```

## Options

Options can be passed via the `[data-input-counter-opts]` in the markup.

***NOTE*** Modifying the defaults on this component may create unintended accessibility behavior. Make sure you have a legitimate need to overide them.

````js
const DEFAULTS = {
    axSizes: {
      small: {
        90: 'polite',
        100: 'assertive'
      },
      large: {
        80: 'polite',
        90: 'polite',
        95: 'assertive',
        100: 'assertive'
      }
    },
    axCounterMsg: (count, max) => `${count} out of ${max} characters remaining`,
    maxInput: 150,
    size: 'large'
  };
````
- ### **axSizes**
  **Type:** `Object`
 
  The axSizes option contains two sub objects: small and large. They drive the counter's aria notification levels. The values are percentages of the max input.
 
  It would be wise to not overwrite these.

- ### **axCounterMsg**
  **Type:** `Function`
  
  If you need to change the message the counter uses, modify this option. This must still be a function, with the signature shown above. The returned string may be changed within the function.

  ***NOTE*** This option should not be changed via options data attribute. If you need to change it, then it must be changed via the instances updateOptions method and it must constructed using standard function syntax(non-arrow).

- ### maxInput
  **Type:** `Integer`
  
  This value can be overidden, but **`should`** be set using the textarea's maxlength attribute, as it takes precendence.

- ### **size**
  **Type:** `String`

  Value can either be `small` or `large`. This tell the counter which subobject of axSizes to use for aria alerts.
