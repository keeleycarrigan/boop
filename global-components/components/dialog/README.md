# Dialog

A dialog/modal plugin that is highly configurable without being too opinionated about style and transition. This plugin relies completely on you for styling so it can provide functionality while staying out of your way so you can create what you need withuout jumping over hurdles.

## Setup

This component is centered on the concept that you can have many links that open the same dialog. While it will dynamically generate a dialog for you in it's entirety, best practice is to have the complete dialog rendered by the server on page load.

### Javascript Initialization

You can pass in dialog triggers OR the actual dialog itself. Regardless, the instance of the component is stored on the dialog. A listener for dialog triggers is delegated from `body` so it's not actually necessary to initialize dialog triggers. Just that they have the proper data attribute (`[data-dialog-trigger]`) and that the value of it points to the dialog `id` it should open.

```javascript
/**
	Simplest initialization. Select your dialog container and pass
	it in with any options if you have any. Also now the variable "dialog"
	stores the instance of the dialog and can run it's methods directly.
**/
const dialog = new momappoki.components.Dialog($('#some-dialog'), { [your options] });

/**
	Have a bunch of image links you'd like to be modal triggers? This will loop
	through all the triggers and prepare the modal frames. Since the content is
	lazy loaded by default the image won't be inserted into the frame until the
	first time a trigger is clicked. Each trigger ID will only create one dialog
	per ID. So if you have multiple triggers that should show a dialog with the
	same content give them the same trigger ID.
**/
$('.image-dialog-trigger').each((i, el) => {
	new momappoki.components.Dialog($(el), { content: { type: 'image' } });
});

/**
	Need to save references to dialogs for control in your javascript?
	This will give you an object with keys that relate to the dialog ID's
	and can hide/show them programatically.
**/

const myDialogs = $('[data-generic-dialog-selector]').toArray().reduce((obj, el) => {
	const $el = $(el);

	obj[$el.attr('id')] = new momappoki.components.Dialog($el);

	return obj;
}, {});

/**
	Result:

	myDialogs = {
		'dialog-1': Dialog instance,
		'dialog-2': Dialog instance,
		'dialog-3': Dialog instance
	}

	Run something.

	myDialogs['dialog-1'].show();
**/

```

### Tridion Dialog Component

1. [https://cmsportal.momappoki.corp/](https://cmsportal.momappoki.corp/)
2. `Create Component`
3. Navgiate to: `Responsive` -> `Module Content` -> [`Pages` or appropriate site section] -> [LOB if `Pages` was chosen] -> [LOB Section]
4. Choose "Title". Best to include "Modal" or "Dialog" in the title.
5. "Schema" -> `Modal Module Schema`
6. [https://cms.momappoki.corp/](https://cms.momappoki.corp/)
7. Navigate to where you'd like to insert the modal component.
8. `Component Presetations` tab -> `insert` -> `Building Blocks` -> `Content` -> `Responsive` -> `Module Content` -> [your path]
9. Select the modal component you made and chose `Modal Module CT` as the Component Template.
10. Click `insert`.
11. Double click the component that was inserted.
12. Choose an `ID` for your dialog.
13. Choose the size. You get 3 - small, medium and large as defined by design.
14. Add any "dialog actions" other than "close", such as "print" or social media links.
15. Input your content.
	* Best practice is to wrap all the content in a `.row`.
	* Add columns as needed. If there are no columns, use at least a `.sm-col-12`.
16. Include the component in `Pre-Core Body Assets` section of your page with `{{id_[TCMID]}}`.
17. **Pro Tip** - If you have multiple dialogs that need to be included on multiple pages think about inserting the dialogs into a SSI freemap and only referencing the SSI in your pages.

## Options

Take notice of options with a `*`. If your Dialog is rendered by the server, these options could alter certain attributes. Some options are grouped under a parent object. Parent objects are shown with brackets. For example:

```js
// [trigger] activeClass

trigger: {
	activeClass: 'dialog-trigger-active'
}

```

##### activePageClass
Class that is applied to the `html` tag. Mostly used to to apply `overflow: hidden` to prevent page scrolling when dialog is open.

Type: `string`  
Default: `'dialog-active'`

##### clickOutsideToHide
Controls whether clicking outside the dialog body will close the dialog.

Type: `boolean`  
Default: `true`

##### lazyload
Controls whether dialog content is pre-loaded before the first time it is opened. The default setting will only load content that is not already inline when the dialog is opened for the first time.

Type: `boolean`  
Default: `true`

##### dialogURL
Can be used to activate HTML 5 History and assign a URL to a dialog.

Type: `string`  
Default: `null`

##### customTemplate
Pass a custom template string for a dialog. Any changes to the default class naming for dialog parts would need to be passes as options as well. _Ex. - if the new template doesn't use `momappoki-dialog` as a class for the main modal structure that option would have to be passed with the new class._

Type: `string`  
Default: `null`


##### [trigger] activeClass
Class that is applied to the trigger used to open the dialog. Can be used for styling if necessary.

Type: `string`  
Default: `dialog-trigger-active`

##### [dialog] active
Class that is applied to the main dialog overlay container.

Type: `string`  
Default: `show`

##### [dialog] attrs
Attributes to be applied to the main dialog overlay container. Use this to apply an `id`, data attributes, or change the default class on the container.

Type: `object`  
Default:

```js
{
	'class': 'momappoki-dialog-wrap',
	'tabindex': '-1'
}
```

##### [dialog] modifier*
Modifier classes that can be applied to the main dialog overlay container. They should be separated by spaces.

Type: `string`  
Default: `''`

##### [dialog] size*
The size that will be applied to the overlay so you get the predefined Dialog sizes set by Design.

Type: `string`  
Default: `'medium'`  
Options: `'small'`, `'medium'`, `'large'`

##### [modal] modifier*
Modifier classes that can be applied to the dialog modal container. They should be separated by spaces.

Type: `string`  
Default: `''`

##### [modal] attrs
Attributes to be applied to the dialog modal container. Use this to apply an `id`, data attributes, or change the default class on the container.

Type: `object`  
Default:

```js
{
	'aria-hidden': true,
    'class': 'momappoki-dialog',
    'role': 'dialog'
}
```

##### [content] modifier*
Modifier classes that can be applied to the dialog content container. They should be separated by spaces.

Type: `string`  
Default: `''`

##### [content] attrs
Attributes to be applied to the dialog content container. Use this to apply an `id`, data attributes, or change the default class on the container.

Type: `object`  
Default: `{ 'class': 'momappoki-dialog-content' }`

##### [content] type
This is the type of content for a dynamically generated dialog. Not used when the entire dialog is rendered by the server.

Type: `string`  
Default: `'inline'`  
Options:

* `'image'` - Will insert an image tag with a `src` set to the `href` of the dialog trigger.
* `'iframe'` - Will insert an iframe with a `src` set to the `href` of the dialog trigger.
* `'ajax'` - Will send an ajax request to the url of the `href` of the dialog trigger. See [ajax](#ajax-settings) option for changing this request's options.
* `'custom'` - Will set the content to whatever is passed in with the `custom` option.

##### [content] custom
Use this to set the content of a dynamically generated dialog directly. Pass in a string of HTML.

Type: `string`/`html`  
Default: `null`

##### [content] loadMsg
Content applied to the content container while it's loading content. When this displays depends on if you've got ajax content and whether you are lazy loading your content.

Type: `string`/`html`  
Default: `'<p class="momappoki-dialog-load-msg">Loading...</p>'`

##### [content] loadFail
Content applied to the content container if loading content fails.

Type: `string`/`html`  
Default: `'<p class="momappoki-dialog-content-fail">Request Failed</p>'`

##### [closeBtn] attrs
Attributes applied to a dynamically generated dialog's close button.

Type: `object`  
Default:

```js
{
	'class': 'momappoki-dialog-close', // The class used to select the dialog close button.
	'data-close-dialog': '', // Attribute that can be applied to any element in the dialog to trigger a close.
	'data-track-ui': 'modal',
	'data-track-elem': 'icon',
	'data-track-name': 'Close',
	'data-track-trigger': 'close',
	'html': '<i class="icon-cancel"></i>' // Content of the close button
}
```

##### [ajax] settings
Settings that can be passed to a jQuery ajax call.

Type: `object`  
Default: `{}`

##### [ajax] context
A jQuery selector string that can be used to select content from a requested page.

Type: `string`  
Default: `false`

##### [autoShow] active
Used to set a dialog to auto show on page load.

Type: `boolean`  
Default: `false`

##### [autoShow] saveClose
Store the "close" action the first time an auto show dialog is shown and closed. If set to true, once an auto show dialog is closed it will not auto show on next page load. If set to false, an auto show dialog will show on every page load.

Type: `boolean`  
Default: `true`

##### [autoShow] saveCloseDuration
How long to save a "closed" log for an auto show modal specified in days. Useful if you would like to make users see a particular message on a set interval no matter how many times they have closed it.

Type: `integer`  
Default: `30`

##### onInit
Callback function that is called on component initialization. Called before `onCreate`. Useful to set options before content is added, dynamic dialogs are built, etc.

Type: `function`  
Default: `$.noop`  
Arguments: `this` (instance of Dialog)

##### onContentLoaded
Callback function that is called after content has been retrieved and appended to the content container. Great for initializing components applied to the dialog dynamically.

Type: `function`  
Default: `$.noop`  
Arguments: `this` (instance of Dialog)

##### onCreate
Callback function that is called after component initialization. A dynamic dialog would have been added to the DOM, and if content is not set to lazyload it would be in the DOM as well.

Type: `function`  
Default: `$.noop`  
Arguments: `this` (instance of Dialog)

##### onShow
Callback function that is called directly after the "show" class is applied to a dialog. Alternatively, you can listen for `'momappoki.dialog-show'` on the `body`.

Type: `function`  
Default: `$.noop`  
Arguments: `this` (instance of Dialog)

##### onHide
Callback function that is called directly after the "show" class is removed from the dialog. Alternatively, you can listen for `'momappoki.dialog-hide'` on the `body`.

Type: `function`  
Default: `$.noop`  
Arguments: `this` (instance of Dialog)

## Instance Methods

##### show

Arguments: `triggerHistory`:`boolean`  

Programmatically show a dialog. Pass true to this method on an instance that has a `dialogURL` set will set the url in History.

##### hide

Arguments: `triggerHistory`:`boolean`  

Programmatically hide a dialog. Pass true to this method on an instance that has a `dialogURL` set will "go back" in History.

##### setOptions

Arguments: `options`:`object`  

Update an instance's options after creation on the fly.



## Usage

#### Examples:
```html
  <div class="row">
    <div class="sm-col-12 sm-pad-2">
      <p>
        <a href="https://momappoki.com" class="momappoki-btn" rel="external">Interstitial Dialog</a>
        <a href="https://momappoki.com" class="momappoki-btn" rel="chat-login">Chat Login</a>
        <a href="https://momappoki.com" class="momappoki-btn" rel="secure-email">Secure Email</a>
      </p>
    </div>
  </div>
```
