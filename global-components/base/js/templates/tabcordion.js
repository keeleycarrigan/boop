(function init (momappoki = {}, _, window) {
  momappoki.templates = momappoki.templates || {};

  /**
    {
      modifiers: '',
      attrs: {},
      items: [
        {
          attrs: {},
          active: false, // or set true on the starting panel
          id: '', // used to connect triggers to panels,
          modifiers: '',
          trigger: {
            text: '',
            attrs: '',
            modifiers: '',
            trackName: ''
          },
          panel: {
            content: '', // HTML
            attrs: '',
            modifiers: ''
          }
        }
      ]
    }
  **/

  function basePanel (type = 'tabcordion') {
    return (`
      <% var isActive = typeof (data.active) === 'boolean' ? data.active : false %>
      <div
        id="<%= data.id %>-panel"
        class="basic-${type}-content <% isActive && print('active-item') %> <%= data.panel.modifiers %>"
        aria-hidden="<%= !isActive %>"
        role="tabpanel"
        data-tabcordion-panel="<%= data.id %>-panel"
        <%= momappoki.templates.utilities.formatAttrs(data.panel.attrs) %>
      >
        <%= data.panel.content %>
      </div>
    `);
  }

  function baseTrigger (type = 'tabcordion') {
    return (`
      <% var isActive = typeof (data.active) === 'boolean' ? data.active : false %>
      <a href="#"
        class="basic-${type}-trigger <% isActive && print('active-item') %> <%= data.trigger.modifiers %>"
        id="<%= data.id %>-panel-label"
        aria-controls="<%= data.id %>-panel"
        aria-expanded="<%= isActive %>"
        aria-selected="<%= isActive %>"
        role="tab"
        data-tabcordion-trigger="<%= data.id %>-panel"
        data-track-elem="tab"
        data-track-name="<%= data.trigger.trackName %>"
        data-track-trigger="switch"
        data-track-state="<% isActive ? print('opened') : print('closed') %>"
        <%= momappoki.templates.utilities.formatAttrs(data.trigger.attrs) %>
      >
        <%= data.trigger.text %>
      </a>
    `);
  }

  function accordionItem () {
    const itemTemplate = `
      <% var isActive = typeof (data.active) === 'boolean' ? data.active : false %>
        <%= momappoki.templates.accordion.trigger()(data) %>
        <%= momappoki.templates.accordion.panel()(data) %>
    `;

    return _.template(itemTemplate, { variable: 'data' });
  }

  function accordionBase (includeWrap = true) {
    console.log('testing');
    const baseTemplate = `
      ${includeWrap ? '<div class="basic-accordion <%= data.modifiers %>" <%= momappoki.templates.utilities.formatAttrs(data.attrs) %>>' : ''}
        <% if (data.items.length) { %>
          <%= data.items.map(function (item) { return momappoki.templates.accordion.item()(item) }).join('') %>
        <% } %>
      ${includeWrap ? '</div>' : ''}
    `;

    return _.template(baseTemplate, { variable: 'data' });
  }

  function tabcordionItem () {
    const itemTemplate = `
      <% var isActive = typeof (data.active) === 'boolean' ? data.active : false %>
        <%= momappoki.templates.tabcordion.trigger()(data) %>
    `;

    return _.template(itemTemplate, { variable: 'data' });
  }

  function tabcordionBase (includeWrap = true) {
    const baseTemplate = `
      ${includeWrap ? '<div class="basic-tabcordion <%= data.modifiers %>" <%= momappoki.templates.utilities.formatAttrs(data.attrs) %>>' : ''}
        <% if (data.items.length) { %>
          <% data.items.forEach(function (item) { %>
            <%= momappoki.templates.tabcordion.item()(item) %>
          <% }) %>
          <div class="basic-tabcordion-panels" data-tabcordion-panel-holder>
          <% data.items.forEach(function (item) { %>
            <%= momappoki.templates.tabcordion.panel()(item) %>
          <% }) %>
          </div>
        <% } %>
      ${includeWrap ? '</div>' : ''}
    `;

    return _.template(baseTemplate, { variable: 'data' });
  }

  momappoki.templates.accordion = {
    base: accordionBase,
    item: accordionItem,
    panel: () => _.template(basePanel('accordion'), { variable: 'data' }),
    trigger: () => _.template(baseTrigger('accordion'), { variable: 'data' })
  };

  momappoki.templates.tabcordion = {
    base: tabcordionBase,
    item: tabcordionItem,
    panel: () => _.template(basePanel(), { variable: 'data' }),
    trigger: () => _.template(baseTrigger(), { variable: 'data' })
  };
})(window.momappoki, _, window);
