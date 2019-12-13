((momappoki = {}, window) => {
  momappoki.templates = momappoki.templates || {};

  function renderControlInput (id, rating, num, itemName) {
    const inputNum = num += 1;
    return `
      <label for="${id}-${inputNum}" class="star-rating-control-label">
        <input type="radio" name="rating-star-input-${id}" id="${id}-${inputNum}" aria-label="Rate ${itemName} ${inputNum} of 5 Stars." class="star-rating-control-input" value="${inputNum}" ${Math.ceil(parseFloat(rating, 10)) === inputNum ? 'checked' : ''}>
      </label>
    `;
  }

  function renderStarControls (id, rating, itemName) {
    return `
      <div class="star-rating-controls" role="radiogroup" data-star-rating-controls="${id}">
        ${_.times(5, num => renderControlInput(id, rating, num, itemName)).join('\n')}
      </div>
    `;
  }

  function starBase (id, rating = 0, size = '', interactive = false, opts = {}) {
    const defaultOptions = {
      itemName: 'Item',
      activeColor: '#F1BA28',
      inactiveColor: '#DDDDDD',
      ariaTitle: null,
      ariaDesc: null
    };
    const options = _.merge({}, defaultOptions, opts);

    const svgTitle = options.ariaTitle ? options.ariaTitle : `${options.itemName} Rating ${rating} Stars`;
    let percentage = 0;

    if (rating > 2.5) {
      percentage = (rating / 5) * 103;
    } else {
      percentage = (rating / 5) * 98;
    }

    return `
      <div class="star-rating ${size}" ${interactive ? `data-star-rating-control-id="${id}"` : ''}>
        ${interactive ? renderStarControls(id, rating, options.itemName) : ''}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 179.7 37" role="img">
          <title id="${options.itemName}-${id}-title">${svgTitle}</title>
          ${options.ariaDesc ? `<desc id="${options.itemName}-${id}-desc">${options.ariaDesc}</desc>` : ''}
          <defs>
            <g id="rating-star-path-${id}">
              <polygon class="star-shape rating-star-1 ${rating >= 1 ? 'active' : ''}" points="17.9,28 7.1,35.1 10.5,22.7 0.3,14.6 13.3,14 17.9,1.9 22.4,14 35.3,14.6 25.1,22.7 28.7,35.1"/>
              <polygon class="star-shape rating-star-2 ${rating >= 2 ? 'active' : ''}" points="53.9,28 43.1,35.1 46.5,22.7 36.3,14.6 49.3,14 53.9,1.9 58.4,14 71.3,14.6 61.1,22.7 64.7,35.1"/>
              <polygon class="star-shape rating-star-3 ${rating >= 3 ? 'active' : ''}" points="89.9,28 79.1,35.1 82.5,22.7 72.3,14.6 85.3,14 89.9,1.9 94.4,14 107.3,14.6 97.1,22.7 100.7,35.1"/>
              <polygon class="star-shape rating-star-4 ${rating >= 4 ? 'active' : ''}" points="125.9,28 115.1,35.1 118.5,22.7 108.3,14.6 121.3,14 125.9,1.9 130.4,14 143.3,14.6 133.1,22.7 136.7,35.1"/>
              <polygon class="star-shape rating-star-5 ${rating === 5 ? 'active' : ''}" points="161.9,28 151.1,35.1 154.5,22.7 144.3,14.6 157.3,14 161.9,1.9 166.4,14 179.3,14.6 169.1,22.7 172.7,35.1"/>
            </g>
            <mask id="star-rating-mask-${id}">
              <rect x="0" y="0" width="${percentage}%" height="100%" id="m-${id}" class="star-rating-progress-bar" fill="white"/>
            </mask>
          </defs>
          <g>
            <use xlink:href="#rating-star-path-${id}" fill="${options.inactiveColor}"/>
            <use mask="url(#star-rating-mask-${id})" xlink:href="#rating-star-path-${id}" fill="${options.activeColor}"/>
          </g>
        </svg>
      </div>
    `;
  }

  momappoki.templates.starRating = starBase;

  window.momappoki = momappoki;
})(window.momappoki, window);
