((momappoki = {}, $, _) => {
  momappoki.components = momappoki.components || {};

  const LOG = _.get(momappoki, 'utilities.logMessage', $.noop);

  const COMPONENT = 'momappoki-star-rating';
  const DATA_OPTS = 'star-rating-opts';
  const EVENT_NAMESPACE = 'star-rating';
  const RATING_CTRL_DATA = 'star-rating-controls';
  const RATING_ID_DATA = 'star-rating-control-id';
  const DEFAULTS = {
    activeClass: 'active',
    hoverClass: 'active',
    starContainerPrefix: '#path-stars',
    starShape: '.star-shape',
    maskPrefix: '#star-rating-mask',
    progressBar: '.star-rating-progress-bar',
    hoverStars: false,
    id: null,
    interactive: false,
    injectTemplate: true,
    templateOpts: {},
    rating: 0,
    starSize: '', // "Default" Size
    onInit: $.noop,
    onRateChange: $.noop
  };

  (function initEnv () {

  })();

  class StarRating {
    constructor ($el, options = {}) {
      if (!(this instanceof StarRating)) { return new StarRating($el, options); }

      let inst = null;

      if ($el && $el instanceof jQuery && $el.length) {
        inst = $.data($el[0], COMPONENT);

        if (!inst) {
          inst = $.data($el[0], COMPONENT, this);

          this.init($el, options);
        }
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

    init ($el, options) {
      this.$el = $el;

      const dataOpts = this.$el.data(DATA_OPTS) || {};

      this.options = $.extend(true, {}, DEFAULTS, options, dataOpts);

      this.options.onInit(this);

      this.id = this.options.id || this.$el.data(RATING_ID_DATA);
      this.injectStars(this.id, this.options);

      this.$controls = $(`[data-${RATING_CTRL_DATA}="${this.id}"]`);
      this.$inputs = this.$controls.find('[type="radio"]');
      this.$progressBar = $(`${this.options.maskPrefix}-${this.id}`).find(this.options.progressBar);
      this.$stars = this.$el.find(this.options.starShape);
      this.rating = this.getRate();

      if (this.options.interactive) {
        this.$controls.on(`change.${EVENT_NAMESPACE}`, '[type="radio"]', this.onChangeRate.bind(this));

        if (this.options.hoverStars) {
          this.$controls.on(`mouseover.${EVENT_NAMESPACE} mouseout.${EVENT_NAMESPACE}`, '[type="radio"]', this.onHoverRate.bind(this));
        }
      }
    }

    getRate () {
      return this.$inputs.filter(':checked').val();
    }

    setRate (rating) {
      this.rating = rating;
      this.$inputs.filter(`[value="${rating}"]`).prop('checked', true);
      this.showStars(rating);

      return this;
    }

    injectStars (id, { rating, starSize, interactive, templateOpts }) {
      this.$el.html(momappoki.templates.starRating(id, rating, starSize, interactive, templateOpts));
    }

    onChangeRate (e) {
      this.rating = $(e.currentTarget).attr('value');
      this.showStars(this.rating);

      this.options.onRateChange(this);
    }

    onHoverRate (e) {
      if (e.type === 'mouseover') {
        const rating = $(e.currentTarget).attr('value');

        this.$stars
          .filter(idx => idx + 1 <= rating)
          .addClass(this.options.hoverClass);
      } else {
        this.$stars.removeClass(this.options.hoverClass)
      }
    }

    showStars (rating) {
      this.$progressBar.attr('width', `${(rating * 100) / this.$inputs.length}%`);
      this.$stars
        .removeClass(this.options.activeClass)
        .filter(idx => idx + 1 <= rating)
        .addClass(this.options.activeClass);

      return this;
    }
  }

  momappoki.components.StarRating = StarRating;
  window.momappoki = momappoki;
})(window.momappoki, window.jQuery, _);
