(function init (boop = {}, window) {
  boop.templates = boop.templates || {};

  boop.templates.modal = function modalTemplate (size = 'medium', trackUI = 'modal') {
    return `
      <div class="momappoki-dialog-wrap ${size}" data-track-elem="modal">
        <div class="momappoki-dialog">
         <div class="momappoki-dialog-content"></div>
         <div class="momappoki-dialog-actions">
           <a href="#" role="button" class="action-btn-close" tabindex="0" data-close-modal data-track-ui="${trackUI}" data-track-elem="icon" data-track-name="Close" data-track-trigger="close" aria-label="Close">
            <i class="boopcon-glyph-close" aria-hidden="true"></i>
            </a>
         </div>
        </div>
      </div>
    `;
  }

  window.boop = boop;
})(window.boop, window);
