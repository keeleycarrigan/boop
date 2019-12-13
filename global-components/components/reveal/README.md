# Reveal

This is a simple component primarily used on E-Sign pages. It starts out by showing some of the container's content and then when a trigger is pressed the entire content is "revealed" and the main trigger button disappears so it cannot be toggled.

## Basic HTML Setup

```html
<div class="reveal-window" data-reveal-id="reveal-id" data-reveal-window="reveal-id">
  <div class="reveal-content" data-reveal-content="reveal-id" aria-hidden="true">
    <!-- your content... -->
  </div>
</div>
<!-- NOTE: Only one trigger should be the "main" trigger.
     Most likely the ".reveal-trigger" that looks like a little tab with an arrow.
-->
<button class="reveal-trigger" data-reveal-main-trigger="reveal-id" aria-label="Button - [Whatever your're supposed to 'review' or 'reveal' ]">
  <i class="momacon-glyph-chevron-down" aria-hidden="true"></i>
</button>


<!-- If there are any other buttons that trigger the Reveal -->
<button class="momappoki-btn" data-reveal-trigger="reveal-1">Read Everything</button>
```
