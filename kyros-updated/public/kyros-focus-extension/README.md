# Kyros Focus extension

## Install in Chrome

1. Extract the downloaded ZIP. Chrome cannot load the ZIP file directly.
2. In Google Chrome, open `chrome://extensions` and enable **Developer mode**.
3. Choose **Load unpacked** and select the extracted folder containing `manifest.json`.
4. Keep only one Kyros Focus copy enabled. To update, replace the folder that Chrome loaded and click **Reload** on its card.
5. Open the same Kyros address in Google Chrome. Click the puzzle-piece **Extensions** button and pin Kyros Focus if you want one-click access.
6. Open **Kyros Focus** from the Extensions menu and click **Connect this tab**. If Chrome asks, allow Kyros to access localhost. The popup injects the bridge into the current tab and the Focus page reports its connection immediately.
7. In Focus, choose Instagram and/or YouTube and start the timer.

The extension does not run in the Codex in-app browser or other embedded previews.

The extension stores the active end time and blocking rules locally. Rules are removed when the timer expires, or when the user pauses or ends the session. Blocked sites show a local Kyros focus page. No browsing history is collected.

## Kyros app origin

The bridge is enabled for `localhost`, `127.0.0.1`, and `*.kyros.app`. If the frontend is deployed on a different domain, add its hostname to the allowlist in both `bridge.js` and `service-worker.js`, then reload the unpacked extension. Keep this allowlist limited to the Kyros frontend origin.

The extension requests access to Instagram and YouTube so Chrome can enforce the selected domain rules across tabs. Access to the Kyros app origin is optional and requested from the toolbar popup only when the user clicks **Connect this tab**.
