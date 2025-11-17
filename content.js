/**
 * content.js
 * Detects the link pattern and adds an ntfy notification button.
 */

const LINK_PATTERN = /^https:\/\/icts\.kuleuven\.be\/apps\/authenticator\//;

// --- NTFY.SH CONFIGURATION ---
const NTFY_TOPIC = 'Fae2Hax5EeKah0ph';
const NTFY_ICON = 'https://play-lh.googleusercontent.com/1tfPDnLuaGVet63nVDT4aT2ebarC6r_EVRHghQT17IqQg_2Yg3swfUfed2OV_SoBSFc';

function findTargetLink() {
  const allLinks = document.querySelectorAll('a');
  for (const link of allLinks) {
    if (link.href && LINK_PATTERN.test(link.href)) {
      return link.href;
    }
  }
  return null;
}

function sendNtfyNotification(linkUrl) {
  const ntfyUrl = `https://ntfy.sh/${NTFY_TOPIC}`;

  const headers = {
    'Title': 'KU Leuven login',
    'Priority': 'urgent',
    'Icon': NTFY_ICON,
    'Click': linkUrl,
    'Cache': 'no',
    'Firebase': 'no'
  };

  fetch(ntfyUrl, {
    method: 'POST',
    headers: headers,
    body: 'Please log in'
  })
    .then(response => {
      const button = document.getElementById('ntfy-link-button');
      if (response.ok) {
        console.log('ntfy.sh notification sent successfully!');
        if (button) {
          const originalText = button.textContent;
          button.textContent = '✅ Notified ntfy!';
          button.style.backgroundColor = '#28a745'; // Green
          setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '#0056b3'; // Original Blue
          }, 3000);
        }
      } else {
        console.error(`ntfy.sh request failed: ${response.status} ${response.statusText}`);
        if (button) {
          button.textContent = `❌ Error: ${response.status}`;
          button.style.backgroundColor = '#dc3545'; // Red
        }
      }
    })
    .catch(error => {
      console.error('Error sending ntfy notification:', error);
      const button = document.getElementById('ntfy-link-button');
      if (button) {
        button.textContent = '❌ Network Error';
        button.style.backgroundColor = '#dc3545'; // Red
      }
    });
}

function createNtfyButton(linkUrl) {
  if (document.getElementById('ntfy-link-button')) {
    return;
  }

  const button = document.createElement('button');
  button.id = 'ntfy-link-button';
  button.textContent = '🔔 Send Link to ntfy';

  button.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 99999;
    background-color: #0056b3;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s;
  `;

  button.addEventListener('click', () => {
    sendNtfyNotification(linkUrl);
  });

  document.body.appendChild(button);
}

function init() {
  const targetLink = findTargetLink();
  if (targetLink) {
    createNtfyButton(targetLink);
    observer.disconnect();
  }
}

const config = { childList: true, subtree: true };

const observer = new MutationObserver((mutationsList, observer) => {
  init();
});

observer.observe(document.body, config);

// Run a check immediately on load, in case the element is there right away
init();
