(function init (momappoki = {}, _, window) {
  momappoki.templates = momappoki.templates || {};

  function formatAttrs (attrs = {}) {
    return _.map(attrs, (val, key) => `${key}="${val}"`).join(' ');
  }

  momappoki.templates.utilities = {
    formatAttrs
  }
})(window.momappoki, _, window);
