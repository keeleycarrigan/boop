(function init (momappoki = {}, _, window) {
  momappoki.templates = momappoki.templates || {};

  /**
    {
      modifiers: '',
      attrs: {},
      navModifiers: '',
      navAttrs: {},
      selectModifiers: '',
      selectID: '', // will be used for name/id on <select /> element.
      selectAttrs: {},
      panelModifiers: '',
      panelAttrs: {},
      hideNav: 'md', // optional, default is 'md'. a change here requires different js component options.
      hideSelect: 'lg', // optional, default is 'lg'. a change here requires different js component options.
      items: [
        {
          attrs: {},
          active: false, // or set true on the starting panel
          id: '', // used to connect triggers to panels,
          modifiers: '',
          trigger: {
            attrs: '',
            modifiers, '',
            text: '',
            trackName: ''
          },
          panel: {
            content: '', // HTML
            attrs: '',
            modifiers, ''
          }
        }
      ]
    }
  **/

  function segCtrlNavTrigger () {
    const triggerTemplate = `
      <% var isActive = typeof (data.active) === 'boolean' ? data.active : false %>
      <a
        href="#"
        id="<%= data.id %>-panel-label"
        class="segmented-ctrl-trigger <% isActive && print('active-item') %> <% _.get(data, 'trigger.modifiers', '') %>"
        aria-controls="<%= data.id %>-panel"
        aria-expanded="<%= isActive %>"
        aria-selected="<%= isActive %>"
        role="tab"
        data-seg-ctrl-trigger="<%= data.id %>-panel"
        data-track-elem="tab"
        data-track-name="<%= _.get(data, 'trigger.trackName', '') %>"
        data-track-trigger="switch"
        data-track-state="<% isActive ? print('opened') : print('closed') %>"
        <%= momappoki.templates.utilities.formatAttrs(_.get(data, 'trigger.attrs', {})) %>
      >
        <%= data.trigger.text %>
      </a>
    `;

    return _.template(triggerTemplate, { variable: 'data' });
  }

  function segCtrlInputBtn (selectID = '') {
    const btnTemplate = `
      <% var isActive = typeof (data.active) === 'boolean' ? data.active : false %>
      <a
        href="#"
        id="${selectID}"
        class="segmented-ctrl-trigger <% isActive && print('active-item') %> <% _.get(data, 'trigger.modifiers', '') %>"
        aria-controls="${selectID}"
        aria-selected="<%= isActive %>"
        role="radio"
        data-seg-ctrl-trigger="<%= data.id %>"
        <%= momappoki.templates.utilities.formatAttrs(_.get(data, 'trigger.attrs', {})) %>
      >
        <%= data.trigger.text %>
      </a>
    `;

    return _.template(btnTemplate, { variable: 'data' });
  }

  function segCtrlItems (type = 'nav') {
    const navTemplate = `
      <% var hideNav = data.hideNav || 'md'; %>
      <% if (data.items.length) { %>
      <nav class="segmented-ctrl-${type}-items hide-<%= hideNav %>-down <%= data.navModifiers %>" <%= momappoki.templates.utilities.formatAttrs(data.navAttrs) %>>
        <% data.items.forEach(function (item) { %>
          ${type === 'nav' ? '<%= momappoki.templates.segmentedCtrl.navTrigger()(item) %>' : '<%= momappoki.templates.segmentedCtrl.inputBtn(data.selectID)(item) %>'}
        <% }) %>
      </nav>
      <% } %>
    `;

    return _.template(navTemplate, { variable: 'data' });
  }

  function segCtrlSelect (type = 'nav') {
    const navTemplate = `
      <% var hideSelect = data.hideSelect || 'lg'; %>
      <% if (data.items.length) { %>
      <div class="segmented-ctrl-select hide-<%= hideSelect %>-up <%= data.selectModifiers %>" <%= momappoki.templates.utilities.formatAttrs(data.selectAttrs) %>>
        <select name="<%= data.selectID %>" id="<%= data.selectID %>" data-seg-ctrl-select>
          <% data.items.forEach(function (item) { %>
            <option value="<%= item.id %>${type === 'nav' ? '-panel' : ''}"><%= item.trigger.text %></option>
          <% }) %>
        </select>
      </div>
      <% } %>
    `;

    return _.template(navTemplate, { variable: 'data' });
  }

  function segCtrlPanels () {
    const panelTemplate = `
      <div class="segmented-ctrl-nav-panels <% data.panelModifiers ? data.panelModifiers : print('sm-pad-t3') %>" data-seg-ctrl-panel-holder <%= momappoki.templates.utilities.formatAttrs(data.panelAttrs) %>>
        <% data.items.forEach(function (item) { %>
          <% var isActive = typeof (item.active) === 'boolean' ? item.active : false %>
          <div
            class="segmented-ctrl-nav-content <% isActive && print('active-item') %> <%= _.get(item, 'panel.modifiers', '') %>"
            id="<%= item.id %>-panel"
            role="tabpanel"
            aria-hidden="<%= !isActive %>"
            data-seg-ctrl-panel="<%= item.id %>-panel"
            <%= momappoki.templates.utilities.formatAttrs(_.get(item, 'panel.attrs', {})) %>
          >
            <%= item.panel.content %>
          </div>
        <% }) %>
      </div>
    `;

    return _.template(panelTemplate, { variable: 'data' });
  }


  function segCtrlBase (type = 'nav', includeWrap = true) {
    const baseTemplate = `
      ${includeWrap && `<div class="segmented-ctrl-${type} <%= data.modifiers %>" <%= momappoki.templates.utilities.formatAttrs(_.get(data, 'trigger.attrs', {})) %>>`}
        <%= momappoki.templates.segmentedCtrl.items('${type}')(data) %>
        <%= momappoki.templates.segmentedCtrl.select('${type}')(data) %>
        ${type === 'nav' ? '<%= momappoki.templates.segmentedCtrl.panels()(data) %>' : ''}
      ${includeWrap && '</div>'}
    `;

    return _.template(baseTemplate, { variable: 'data' });
  }

  momappoki.templates.segmentedCtrl = {
    base: segCtrlBase,
    navTrigger: segCtrlNavTrigger,
    items: segCtrlItems,
    inputBtn: segCtrlInputBtn,
    select: segCtrlSelect,
    panels: segCtrlPanels
  };

})(window.momappoki, _, window);
