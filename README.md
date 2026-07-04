# Authenticate to Ntfy

A browser extension that simplifies KU Leuven logins by sending authentication links directly to your phone via [ntfy](https://ntfy.sh).

## Features

- Detects KU Leuven authentication links on the IdP login pages.
- Adds a "Send Link to ntfy" button to the page.
- Sends a push notification to your specified ntfy server and topic with a direct link to the authentication app.
- Configurable ntfy server, topic, and optional username/password credentials via the extension options.

## Installation

### From Source

1. Clone or download this repository.
2. Open your browser's extension management page:
   - Firefox: `about:debugging#/runtime/this-firefox`
   - Chrome/Edge: `chrome://extensions`
3. Load the extension:
   - Firefox: Click **Load Temporary Add-on** and select the `manifest.json`.
   - Chrome/Edge: Enable **Developer mode** and click **Load unpacked**, then select the project folder.

### Building

If you have `make` installed, you can create a zip file for distribution:

```bash
make
```

## Configuration

1. Open the extension options/settings.
2. Enter your preferred **ntfy server**. The default is `https://ntfy.sh`.
3. Enter your preferred **ntfy topic**.
4. (Optional) Enter your **username** and **password** for ntfy Basic Authentication.
5. Save the settings and approve the server permission if prompted.
6. Subscribe to the same topic on your mobile device using the ntfy app.

## How it works

The extension monitors `idp.kuleuven.be` pages for links matching the pattern `https://icts.kuleuven.be/apps/authenticator/`. When found, it displays a button that, when clicked, POSTS a notification to the configured ntfy server containing the login link.
