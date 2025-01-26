document.addEventListener('DOMContentLoaded', () => {
  const enable_scroll = document.getElementById('enable-scroll');
  const action_checkbox = document.getElementById('action-checkbox');
  const onclick_checkbox = document.getElementById('onclick-checkbox');
  const  load_checkbox = document.getElementById('load-checkbox');
  const saveButton = document.getElementById('save');

  chrome.storage.sync.get(['autoChangeOnLoad', 'autoChangeOnClick', 'autoChangeOnBadgeClick', 'autoChangeOnScroll'], (items) => {
    if (items.autoChangeOnLoad !== undefined) {
      load_checkbox.checked = items.autoChangeOnLoad;
    }
    if (items.autoChangeOnClick) {
      onclick_checkbox.checked = items.autoChangeOnClick;
    }
    if (items.autoChangeOnBadgeClick) {
      action_checkbox.checked = items.autoChangeOnBadgeClick;
    }
    if (items.autoChangeOnScroll) {
      enable_scroll.checked = items.autoChangeOnScroll;
    }

  });

  // Save settings when the user clicks the save button
  saveButton.addEventListener('click', () => {
    chrome.storage.sync.set({
      autoChangeOnLoad: load_checkbox.checked,
      autoChangeOnClick: onclick_checkbox.checked,
      autoChangeOnScroll: enable_scroll.checked,
      autoChangeOnBadgeClick: action_checkbox.checked,
    }, () => {
      alert('Your settings have been saved successfully!');
    });
  });
});