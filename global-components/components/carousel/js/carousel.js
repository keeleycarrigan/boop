((momappoki = {}, $, _) => {
  momappoki.components = momappoki.components || {};

  const LOG = _.get(momappoki, 'utilities.logMessage', $.noop);
  const ROUND_NUMBER = _.get(momappoki, 'utilities.roundNumber', $.noop);
  const COMPONENT = 'momappoki-carousel';
  const DATA_OPTS = 'carousel-opts';
  const EVENT_NAMESPACE = 'carousel';
  const SLIDE_CHANGE_EVENT_NAME = 'momappoki.carousel.slideChange';

  const ITEM_SELECTOR = '[data-carousel-item]';
  const STAGE_SELECTOR = '[data-carousel-stage]';
  const VIEWPORT_SELECTOR = '[data-carousel-viewport]';
  const NAV_SELECTOR = '[data-carousel-nav]';
  const NEXT_NAV_SELECTOR = '[data-carousel-nav="next"]';
  const PREV_NAV_SELECTOR = '[data-carousel-nav="prev"]';
  const NAV_PANEL_WRAPPER = '[data-carousel-nav-item-wrapper]';
  const NAV_PANEL_SELECTOR = '[data-carousel-nav-items]';
  const NAV_BTN_SELECTOR = '[data-carousel-nav-btn]';

  const NAV_DATA = 'carousel-nav';
  const PANEL_SIZE_DATA = 'carousel-panel-sizes';
  const SLIDE_POSITION = 'carousel-position';

  // Can refactor out below when we have a global utility.
  const IS_TOUCH = (() => (('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch || navigator.maxTouchPoints > 0) === true))();
  const CLICK_ACTION = (() => (IS_TOUCH && !navigator.pointerEnabled ? `touchstart.${EVENT_NAMESPACE}` : `click.${EVENT_NAMESPACE}`))();
  const KEYBOARD_ACTION = `keydown.${EVENT_NAMESPACE}`;

  const BP_ORDER = ['small', 'medium', 'large', 'xlarge', 'xxlarge'];
  const WIDTHS = {
    full: '100%',
    half: '50%',
    third: '33.3333%',
    quarter: '25%'
  };

  let instances = [];
  let envInitialized = false;

  function initEnv () {
    $(window).on('resize', _.debounce(() => {
      _.each(instances, (obj) => {
        obj.updateStage();
        obj.goToSlide(obj.defaultSlide, false, false);
      });
    }, 125));
    envInitialized = true;
  }

  const DEFAULTS = {
    defaultPanelSizes: {
      small: 'full'
    },
    defaultItem: 0,
    itemAriaLabelPrefix: 'Feature',
    onInit: $.noop
  };
  /**
   * A Javascript component that creates and manages a media carousel.
   * A carousel is essentially a slide show. Slides can be images, videos, or html content.
   *
   * @class Carousel
   */
  class Carousel {
    /**
     * Gets the current Carousel instance attached to the specified element.
     *
     * @static
     * @param {jQuery Element} $el
     * @returns Carousel instance
     * @memberof Carousel
     */
    static getInstance ($el) {
      let inst = null;

      if ($el && $el instanceof jQuery && $el.length) {
        inst = $.data($el[0], COMPONENT);
      }

      return inst;
    }

    /**
     * Creates an instance of Carousel.
     *
     * @param {jQuery Element} $el
     * @param {Object} [options={}]
     * @memberof Carousel
     */
    constructor ($el, options = {}) {
      // $el should be carousel container.
      if (!(this instanceof Carousel)) {
        return new Carousel($el, options);
      }

      let inst = null;

      if ($el && $el instanceof jQuery && $el.length) {
        inst = $.data($el[0], COMPONENT);

        if (!inst) {
          inst = $.data($el[0], COMPONENT, this);
          instances = [...instances, this];

          this.init($el, options);
        }
      }

      return inst;
    }

    /**
     * Initializes carousel data and events. Called from constructor
     *
     * @param {jQuery Element} $el
     * @param {Object} options
     * @memberof Carousel
     */
    init ($el, options) {
      if (!envInitialized) {
        initEnv();
      }

      this.$el = $el;

      const dataOpts = this.$el.data(DATA_OPTS) || {};

      this.options = $.extend(true, {}, DEFAULTS, options, dataOpts);
      this.options.onInit(this);

      this.$stage = this.$el.find(STAGE_SELECTOR);
      this.$viewport = this.$el.find(VIEWPORT_SELECTOR);
      this.$forwardArrow = this.$el.find(NEXT_NAV_SELECTOR);
      this.$reverseArrow = this.$el.find(PREV_NAV_SELECTOR);
      this.$navPanelWrapper = this.$el.find(NAV_PANEL_WRAPPER);
      this.$navPanel = this.$el.find(NAV_PANEL_SELECTOR);

      this.updateStage();
      this.goToSlide(this.defaultSlide);

      this.$el
        .on(`${CLICK_ACTION} ${KEYBOARD_ACTION}`, NAV_SELECTOR, this.handleNavClick.bind(this))
        .on(`${CLICK_ACTION} ${KEYBOARD_ACTION}`, NAV_BTN_SELECTOR, this.jumpToSlide.bind(this));

      if (IS_TOUCH) {
        Hammer(this.$viewport[0]).on('swipeleft swiperight', this.handleNavClick.bind(this));
      }
    }

    /**
     * This extracts item sizes from markup and also creates ids for items that do not have one specified.
     *
     * @param {Object} [overideSizes]
     * @returns Array of parsed carousel item object
     * @memberof Carousel
     * @private
     */
    _getItemData (overideSizes) {
      const items = this.$el.find(ITEM_SELECTOR).toArray();
      return items.map((el, idx) => {
        const $el = $(el);
        const sizes = this._getSizeData(overideSizes || $el.data(PANEL_SIZE_DATA));
        const isDefault = idx === this.options.defaultItem;

        const attributes = {
          'aria-label': `${this.options.itemAriaLabelPrefix} ${idx + 1} of ${items.length}`,
          'aria-hidden': true
        };

        $el.attr(attributes);

        return {
          $el,
          isDefault,
          ...sizes
        };
      });
    }

    /**
     * Finds last specified breakpoint in a carousel item's markup.
     *
     * @param {Object} panelSizes
     * @param {Array} bpRange
     * @returns The last breakpoint found.
     * @memberof Carousel
     * @private
     */
    _getLastBP (panelSizes, bpRange) {
      return _.findLast(bpRange, bp => typeof (panelSizes[bp]) !== 'undefined');
    }

    /**
     * Get the size data from an item's markup
     *
     * @param {Object} [sizes=this.options.defaultPanelSizes]
     * @returns An object containing the item.s size per breakpoint data.
     * @memberof Carousel
     * @private
     */
    _getSizeData (sizes = this.options.defaultPanelSizes) {
      return BP_ORDER.reduce((obj, bp, idx) => {
        /**
         * This checks to see if the breakpoint name is specified and it's not
         * it tries to find the last specified breakpoint. Adding 1 to the index
         * so the slice is inclusive.
         */
        const bpName = sizes[bp] ? bp : this._getLastBP(sizes, BP_ORDER.slice(0, idx + 1));
        /**
         * This looks weird, but it basically says that if a breakpoint's size isn't
         * already in the WIDTHS table then it must be a custom width so set the
         * breakpoint width to that.
         */
        obj[bp] = WIDTHS[sizes[bpName]] || sizes[bpName];

        return obj;
      }, {});
    }

    /**
     * Sets item width and stage width based on breakpoint.
     *
     * @param {Collection} [itemData=this.itemData]
     * @param {jQuery Element} [$stage=this.$stage]
     * @param {jQuery Element} [$viewport=this.$viewport]
     * @returns The current Carousel instance
     * @memberof Carousel
     */
    _setWidths (itemData = this.itemData, $stage = this.$stage, $viewport = this.$viewport) {
      const {
        breakpoint
      } = momappoki.services.mediaQuery.currentInfo();

      this.viewportWidth = $viewport.width();
      this.stageWidth = itemData.reduce((stageWidth, item) => {
        const bpWidth = item[breakpoint];
        const floatwidth = bpWidth && bpWidth.indexOf('%') > -1 ? (parseFloat(bpWidth) / 100) * this.viewportWidth : parseFloat(bpWidth);
        const width = ROUND_NUMBER(floatwidth, 2);

        item.$el.css({
          width
        });
        item.width = width;
        stageWidth += width;

        return stageWidth;
      }, 0);

      $stage.css({
        minWidth: this.stageWidth
      });

      this._setSlidePositions();

      return this;
    }

    /**
     * Sets viewport minHeight for carousel based on tallest carousel item.
     *
     * @returns The current Carousel instance
     * @memberof Carousel
     * @private
     */
    _setViewportHeight () {
      const panelHeights = this.itemData.map(item => item.$el.outerHeight());

      this.$viewport.css({
        minHeight: Math.max(...panelHeights)
      });

      return this;
    }

    /**
     * Calculates the left position of each slide on the stage based on total stage width divided by the current viewport width.
     * Adds these positions to the slides array. These are then used to create the nav buttons.
     *
     * @param {Collection} [items = this.itemData]
     * @memberof Carousel
     * @private
     */
    _setSlidePositions (items = this.itemData) {
      LOG('carousel.js:%cCarousel Item Data', 'color:blue', items);
      LOG('carousel.js:%cCarousel Viewport Width', 'color:blue', this.viewportWidth);
      LOG('carousel.js:%cCarousel Stage Width', 'color:blue', this.stageWidth);
      let currentSlideWidth = 0;
      let key = 1;
      let position = 0;
      const defaultSlide = false;

      const itemLength = items.length;
      const lastItemIndex = itemLength - 1;


      this.slides = items.reduce((slides, item, index) => {
        const isLastItem = index === lastItemIndex;

        let makeSlide = false;

        item.slide = key;

        if (currentSlideWidth + item.width === this.viewportWidth) {
          currentSlideWidth += item.width;
          makeSlide = !isLastItem;
        } else if (currentSlideWidth + item.width < this.viewportWidth) {
          currentSlideWidth += item.width;
          if (index === lastItemIndex - 1 && currentSlideWidth + items[lastItemIndex].width >= this.viewportWidth) {
            const possibleWidth = currentSlideWidth + items[lastItemIndex].width - this.viewportWidth;
            currentSlideWidth = possibleWidth !== 0 ? possibleWidth : currentSlideWidth;
            makeSlide = possibleWidth !== 0;
          } else if (!isLastItem && currentSlideWidth + items[index + 1].width > this.viewportWidth) {
            makeSlide = true;
          }
        } else if (currentSlideWidth + item.width > this.viewportWidth) {
          makeSlide = true;
        }

        LOG(`carousel.js:%cCarousel Slide width at ${index} = ${item.width}, total slide width = ${currentSlideWidth}`, 'color:blue');

        if (makeSlide) {
          position = position - currentSlideWidth;
          key++;
          LOG(`carousel.js:%cMake new slide starting at ${position}`, 'color:green');

          slides = [...slides, {
            key,
            position,
            defaultSlide,
            items: []
          }];

          currentSlideWidth = 0;
        }

        if (isLastItem) {
          slides[slides.length - 1].position = this.viewportWidth - this.stageWidth;
        }

        return slides;
      }, [{
        key: 1,
        position: 0,
        items: []
      }]);

      const defaultItem = _.find(items, 'isDefault');
      this.slides[defaultItem.slide - 1].defaultSlide = true;

      _.each(this.slides, (slide) => {
        slide.items = items.reduce((slideItems, item) => {
          if (item.slide === slide.key) {
            slideItems = [...slideItems, item.$el[0]];
          }
          return slideItems;
        }, []);
      });

      this.defaultSlide = defaultItem.slide;
      this.totalSlides = this.slides.length;

      LOG('carousel.js:%cCarousel Items with slide designation = ', 'color:green', items);
      LOG('carousel.js:%cSlides = ', 'color:green', this.slides);
    }

    /**
     * Creates and adds nav buttons to carousel based on breakpoint.
     *
     * @param {Collection} [slides=this.slides]
     * @param {jQuery Element} [$navPanel=this.$navPanel]
     * @memberof Carousel
     * @private
     */
    _setNavMarkers (slides = this.slides, $navPanel = this.$navPanel) {
      $navPanel.html('');
      const navButtons = [];
      _.each(slides, (slide) => {
        navButtons.push($(`<button type="button" class="basic-carousel-nav-btn" data-carousel-nav-btn data-carousel-position="${slide.key}" aria-pressed="false" aria-label="Show view ${slide.key} of ${slides.length}"></button>`));
      });
      $navPanel.html(navButtons);
      this.navButtonWidth = undefined;
      this.navPanelWidth = navButtons.reduce((navPanelWidth, $button) => {
        if (!this.navButtonWidth) {
          this.navButtonWidth = $button.outerWidth(true);
        }
        navPanelWidth += $button.outerWidth(true);

        return navPanelWidth;
      }, 0);

      $navPanel.css({
        minWidth: this.navPanelWidth
      });
    }

    /**
     * Inserts a new item into carousel At specified index.
     *
     * @param {Number} index The index to insert at.
     * @param {jQuery Object} $item The item to insert
     * @memberof Carousel
     * @private
     */
    _insertCarouselItem (index, $item) {
      const $target = this.$stage.children().eq(index);
      $target.after($item);
    }

    /**
     * Enable/Disable focusable elements based on current slide.
     *
     * @param {jQuery Collection} $foundItems
     * @memberof Carousel
     */
    _toggleTabs ($foundItems) {
      const $allItems = $(ITEM_SELECTOR);
      $allItems.attr('aria-hidden', true).find(':focusable').attr('tabindex', '-1');
      $foundItems.attr('aria-hidden', false).find(':focusable').attr('tabindex', '');
    }

    /**
     * Enable/Disable Nav Arrows base on current slide
     *
     * @memberof Carousel
     * @private
     */
    _toggleNavArrows () {
      if (this.currentSlide === this.totalSlides) {
        this.$forwardArrow
          .addClass('disabled')
          .attr('aria-disabled', true);
        this.$reverseArrow
          .removeClass('disabled')
          .attr('aria-disabled', false);
      } else if (this.currentSlide === 1) {
        this.$forwardArrow
          .removeClass('disabled')
          .attr('aria-disabled', false);
        this.$reverseArrow
          .addClass('disabled')
          .attr('aria-disabled', true);
      } else {
        this.$forwardArrow
          .removeClass('disabled')
          .attr('aria-disabled', false);
        this.$reverseArrow
          .removeClass('disabled')
          .attr('aria-disabled', false);
      }
    }

    /**
     * Updates carousel items, widths, and slide pagination.
     *
     * @returns The current Carousel instance
     * @memberof Carousel
     */
    updateStage () {
      this.itemData = this._getItemData();
      this._setWidths()._setViewportHeight()._setNavMarkers();
      return this;
    }

    /**
     * Updates Carousel base options.
     * Does not refresh Carousel
     *
     * @param {Object} [newOptions={}]
     * @returns The current Carousel instance
     * @memberof Carousel
     */
    updateOptions (newOptions = {}) {
      const currentOpts = { ...this.options };
      this.options = $.extend(true, {}, currentOpts, newOptions);
      this.updateStage();
      return this;
    }

    /**
     * Changes the position of an item in the carousel.
     * updateStage MUST be called after all reordering calls are performed.
     *
     * @param {Number} oldIndex 0-based index of item to move.
     * @param {Number} newIndex 0-based index of where to place item.
     * @returns The current Carousel instance
     * @memberof Carousel
     */
    updateItemOrder (oldIndex, newIndex) {
      const items = this.$stage.children();
      const $found = $(items.get(oldIndex));
      const newPosition = newIndex < items.length ? newIndex : items.children().length - 1;
      const $insertPoint = $(items.get(newPosition));
      if ($found.length > 0) {
        $found.detach();
        $insertPoint.after($found);
      }

      return this;
    }

    /**
     * Adds a new item to carousel stage.
     *
     * @param {Object} { sizes, content, index } Sizes are breakpoints sizes. See readme. Content is the html or other content that will inserted into the item. Index is the 0-based position to insert at. If index is not provided, then item will be added to end.
     * @returns The current Carousel instance
     * @memberof Carousel
     */
    addCarouselItem ({
      sizes,
      content,
      index
    }) {
      const carouselItemTemplate = `<div class="basic-carousel-panel" data-carousel-item data-carousel-panel-sizes='${sizes}'>${content}</div>`;
      if (index) {
        this._insertCarouselItem(index, $(carouselItemTemplate));
      } else {
        this.$stage.append($(carouselItemTemplate));
      }
      this.updateStage();
      return this;
    }

    /**
     * Removes an item from the carousel stage
     *
     * @param {String} itemIndex The 0-based index of item to remove;
     * @returns The current Carousel instance
     * @memberof Carousel
     */
    removeCarouselItem (itemIndex) {
      const $found = this.$stage.find(ITEM_SELECTOR)[itemIndex];
      if ($found.length > 0) {
        $found.remove();
        this.updateStage();
      }
      return this;
    }

    /**
     * Handles setting nav button active class and animating stage.
     * Shows specified slide.
     *
     * @param {Number} slideToShow The slide key to find and show.
     * @param {Boolean} [focus=false] Should focus on viewport be triggered.
     * @param {Boolean} [track=true] Should fire tracking event for DTM.
     * @param {jQuery Collection} [$navPanel=this.$navPanel]
     * @param {Collection} [slides=this.slides]
     * @param {jQuery Object} [$viewport=this.$viewport]
     * @memberof Carousel
     */
    goToSlide (slideToShow, focus = false, track = true, $navPanel = this.$navPanel, slides = this.slides, $viewport = this.$viewport) {
      if (track) {
        const trackData = {
          instance: this,
          element: this.$el[0],
          currentSlide: slideToShow,
          direction: this.currentSlide > slideToShow ? 'Previous' : 'Next'
        };
        const slideChangeEvent = new CustomEvent(SLIDE_CHANGE_EVENT_NAME, { bubbles: true, cancelable: true, detail: trackData });
        LOG('carousel.js:%cCustomEvent-momappoki.carousel.slideChange', 'color:green', slideChangeEvent);
        const body = document.querySelector('body');
        body.dispatchEvent(slideChangeEvent);
      }

      this.currentSlide = slideToShow;

      const foundSlide = _.find(slides, slide => slide.key === this.currentSlide);
      const $target = $navPanel.find(`[data-${SLIDE_POSITION}="${foundSlide.key}"]`);

      $viewport.attr('aria-label', `View ${foundSlide.key} of ${slides.length}`);
      $navPanel.find(NAV_BTN_SELECTOR).removeClass('active').attr('aria-pressed', false);
      $target.addClass('active').attr('aria-pressed', true);

      this._toggleTabs($(foundSlide.items));
      this._toggleNavArrows();

      this.$stage.css('left', `${foundSlide.position}px`);
      this.$navPanelWrapper.scrollLeft(this.navButtonWidth * (foundSlide.key - 1));

      if (focus) {
        $viewport.focus();
      }
    }

    /**
     * Event Handler for nav buttons.
     *
     * @param {DOM Event} e
     * @memberof Carousel
     */
    jumpToSlide (e) {
      let focus = false;
      const {
        isEnter
      } = momappoki.utilities.convertKeyCode(e);
      if (e.keyCode) {
        focus = true;
        if (!isEnter) {
          return;
        }
      }
      this.goToSlide($(e.currentTarget).data(SLIDE_POSITION), focus);
    }

    /**
     *Goes to previous slide
     *
     * @memberof Carousel
     */
    prevSlide (focus) {
      this.goToSlide(this.currentSlide - 1, focus);
    }

    /**
     *Goes to next slide
     *
     * @memberof Carousel
     */
    nextSlide (focus) {
      this.goToSlide(this.currentSlide + 1, focus);
    }

    /**
     * Event handler for mouse nav arrows and touch swipe.
     *
     * @param {DOM Event} e
     * @memberof Carousel
     */
    handleNavClick (e) {
      let navDir;
      let focus = false;
      const {
        isEnter
      } = momappoki.utilities.convertKeyCode(e);
      if (e.keyCode) {
        focus = true;
        if (!isEnter) {
          return;
        }
      }
      if (e.currentTarget) {
        navDir = $(e.currentTarget).data(NAV_DATA);
      } else if (e.direction) {
        if (e.direction === Hammer.DIRECTION_LEFT) {
          navDir = 'next';
        }
        if (e.direction === Hammer.DIRECTION_RIGHT) {
          navDir = 'prev';
        }
      }
      if (navDir === 'next') {
        this.nextSlide(focus);
      } else if (navDir === 'prev') {
        this.prevSlide(focus);
      }
    }
  }

  momappoki.components.Carousel = Carousel;
  window.momappoki = momappoki;
})(window.momappoki, window.jQuery, _);
