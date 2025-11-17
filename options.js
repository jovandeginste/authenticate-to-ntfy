// A key for storing the topic in extension storage
const STORAGE_KEY = 'ntfyTopic';

// Saves the topic entered by the user
function saveOptions() {
  const topic = document.getElementById('ntfyTopic').value.trim();

  if (topic === "") {
    document.getElementById('status').textContent = 'Error: Topic cannot be empty.';
    return;
  }

  // Use storage.local.set to save the value
  browser.storage.local.set({
    [STORAGE_KEY]: topic
  }).then(() => {
    // Show confirmation status
    const status = document.getElementById('status');
    status.textContent = 'Topic saved!';
    setTimeout(() => {
      status.textContent = '';
    }, 2000);
  });
}

// Loads the previously saved topic when the options page is opened
function restoreOptions() {
  // Use storage.local.get to retrieve the value
  browser.storage.local.get(STORAGE_KEY).then((result) => {
    // Default topic if none is saved yet
    const defaultTopic = 'default-link-alerts';
    const currentTopic = result[STORAGE_KEY] || defaultTopic;
    document.getElementById('ntfyTopic').value = currentTopic;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('saveButton').addEventListener('click', saveOptions);
