const DEFAULT_NTFY_SERVER = 'https://ntfy.sh';
const DEFAULT_NTFY_TOPIC = 'default-link-alerts';
const NTFY_TOPIC_STORAGE_KEY = 'ntfyTopic';
const NTFY_SERVER_STORAGE_KEY = 'ntfyServer';
const NTFY_USERNAME_STORAGE_KEY = 'ntfyUsername';
const NTFY_PASSWORD_STORAGE_KEY = 'ntfyPassword';

function normalizeServer(server) {
  const url = new URL(server);

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error('Server URL must start with http:// or https://.');
  }

  return url.origin;
}

function toBasicAuthHeader(username, password) {
  if (!username || !password) {
    return null;
  }

  return `Basic ${btoa(`${username}:${password}`)}`;
}

async function sendTestNotification(server, topic, username, password) {
  const ntfyUrl = `${server}/${encodeURIComponent(topic)}`;
  const headers = {
    'Title': 'Authenticate to Ntfy',
    'Priority': 'default'
  };

  const authHeader = toBasicAuthHeader(username, password);
  if (authHeader) {
    headers.Authorization = authHeader;
  }

  const response = await fetch(ntfyUrl, {
    method: 'POST',
    headers,
    body: 'Test notification from the extension options page.'
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
}

async function requestServerPermission(server) {
  const url = new URL(server);
  const originPattern = `${url.protocol}//${url.hostname}/*`;

  return browser.permissions.request({
    origins: [originPattern]
  });
}

// Saves the ntfy settings entered by the user
async function saveOptions() {
  const topic = document.getElementById('ntfyTopic').value.trim();
  const serverInput = document.getElementById('ntfyServer').value.trim();
  const username = document.getElementById('ntfyUsername').value.trim();
  const password = document.getElementById('ntfyPassword').value;
  const status = document.getElementById('status');

  if (topic === "") {
    status.textContent = 'Error: Topic cannot be empty.';
    return;
  }

  if ((username && !password) || (!username && password)) {
    status.textContent = 'Error: Provide both username and password, or leave both empty.';
    return;
  }

  let server;
  try {
    server = normalizeServer(serverInput || DEFAULT_NTFY_SERVER);
  } catch (error) {
    status.textContent = `Error: ${error.message}`;
    return;
  }

  const permissionGranted = await requestServerPermission(server);
  if (!permissionGranted) {
    status.textContent = 'Error: Permission for this ntfy server was not granted.';
    return;
  }

  // Use storage.local.set to save the value
  browser.storage.local.set({
    [NTFY_TOPIC_STORAGE_KEY]: topic,
    [NTFY_SERVER_STORAGE_KEY]: server,
    [NTFY_USERNAME_STORAGE_KEY]: username,
    [NTFY_PASSWORD_STORAGE_KEY]: password
  }).then(() => {
    // Show confirmation status
    status.textContent = 'Settings saved!';
    setTimeout(() => {
      status.textContent = '';
    }, 2000);
  });
}

async function testNotificationChannel() {
  const topic = document.getElementById('ntfyTopic').value.trim();
  const serverInput = document.getElementById('ntfyServer').value.trim();
  const username = document.getElementById('ntfyUsername').value.trim();
  const password = document.getElementById('ntfyPassword').value;
  const status = document.getElementById('status');

  if (topic === '') {
    status.textContent = 'Error: Topic cannot be empty.';
    return;
  }

  if ((username && !password) || (!username && password)) {
    status.textContent = 'Error: Provide both username and password, or leave both empty.';
    return;
  }

  let server;
  try {
    server = normalizeServer(serverInput || DEFAULT_NTFY_SERVER);
  } catch (error) {
    status.textContent = `Error: ${error.message}`;
    return;
  }

  status.textContent = 'Sending test notification...';

  try {
    await sendTestNotification(server, topic, username, password);
    status.textContent = 'Test notification sent successfully!';
  } catch (error) {
    status.textContent = `Error: ${error.message}`;
  }
}

// Loads the previously saved settings when the options page is opened
function restoreOptions() {
  // Use storage.local.get to retrieve the value
  browser.storage.local.get([
    NTFY_TOPIC_STORAGE_KEY,
    NTFY_SERVER_STORAGE_KEY,
    NTFY_USERNAME_STORAGE_KEY,
    NTFY_PASSWORD_STORAGE_KEY
  ]).then((result) => {
    document.getElementById('ntfyTopic').value = result[NTFY_TOPIC_STORAGE_KEY] || DEFAULT_NTFY_TOPIC;
    document.getElementById('ntfyServer').value = result[NTFY_SERVER_STORAGE_KEY] || DEFAULT_NTFY_SERVER;
    document.getElementById('ntfyUsername').value = result[NTFY_USERNAME_STORAGE_KEY] || '';
    document.getElementById('ntfyPassword').value = result[NTFY_PASSWORD_STORAGE_KEY] || '';
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('saveButton').addEventListener('click', saveOptions);
document.getElementById('testButton').addEventListener('click', testNotificationChannel);
