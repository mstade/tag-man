# Prisetiketter – PWA

Price tag generator that installs on iPhone via **Add to Home Screen** and works offline.

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole app |
| `manifest.webmanifest` | App name, icons, standalone display |
| `sw.js` | Service worker: offline support and font caching |
| `icons/` | Home screen and app icons |

## Install on iPhone

iOS installs web apps only from a page loaded over **HTTPS**. A file opened from the Files app can't be added to the Home Screen, and service workers don't run there.

1. Put the contents of this folder on any static HTTPS host. Upload the files as they are; there is no build step.
2. On the iPhone, open the address in **Safari**.
3. Tap **Share → Add to Home Screen**. If an **Open as Web App** switch is shown, leave it on. Then tap **Add**.
4. Open the app once while online so it caches itself and the fonts. After that it starts and works without a connection.

## Printing

- **In Safari:** **Print** opens the normal print dialog.
- **From the Home Screen:** **Print** and **Share PDF** build a PDF of the sheets and open the share sheet. From there choose Print, Save to Files or AirDrop. This route is used because `window.print()` may not work in Home Screen apps.
- **PDF content:** each page has the exact paper size. Pages are rendered at up to 300 dpi.

## Data

- **Where it's stored:** products and settings are kept on the device.
- **Separate from Safari:** the Home Screen app has its own storage, separate from Safari.
- **Moving data:** use **Paper & style → Export / Import** to move products between Safari and the app, or between devices.

## Fonts

- **Built-in:** "System (SF Pro)" needs no network.
- **Google Fonts:** all other fonts load from Google Fonts. The service worker keeps each one you have used once, so it also works offline.

## Updating

1. Change the files and upload them again.
2. In `sw.js`, raise `VERSION` (for example `'v2'`).
3. The installed app picks up the new version in the background and shows it the next time it starts.
