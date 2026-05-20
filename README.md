# Authenticate to Ntfy

A browser extension that simplifies KU Leuven logins by sending authentication links directly to your phone via [ntfy.sh](https://ntfy.sh).

## Features

- Detects KU Leuven authentication links on the IdP login pages.
- Adds a "Send Link to ntfy" button to the page.
- Sends a push notification to your specified ntfy topic with a direct link to the authentication app.
- Configurable ntfy topic via the extension options.

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
2. Enter your preferred **ntfy.sh topic**.
3. Save the settings.
4. Subscribe to the same topic on your mobile device using the ntfy app.

## How it works

The extension monitors `idp.kuleuven.be` pages for links matching the pattern `https://icts.kuleuven.be/apps/authenticator/`. When found, it displays a button that, when clicked, POSTS a notification to `ntfy.sh` containing the login link.
