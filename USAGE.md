# XpanelERP PWA - Usage Guide

This guide explains how to install and use the **XpanelERP PWA** module for Odoo.

## 1. Installation

### Prerequisites

- Odoo version 15.0 or later (compatible with 16.0, 17.0, and 18.0).
- The `hr_timesheet` module should be available in your Odoo instance.

### Steps

1.  **Copy the Module**: Ensure the `pwa` folder is in your Odoo `addons` directory.
2.  **Update Addons Path**: If you added a new directory, update your `odoo.conf` file's `addons_path`.
3.  **Restart Odoo**: Restart your Odoo server to detect the new module.
4.  **Activate Developer Mode**: Go to Odoo **Settings** and click **Activate the developer mode**.
5.  **Update Apps List**: Go to the **Apps** menu and click **Update Apps List** in the top bar.
6.  **Install**: Search for `pwa` or "XpanelERP PWA" and click **Install**.

---

## 2. Using as a Progressive Web App (PWA)

### Mobile (iOS/Android)

1.  Open your Odoo URL in Chrome (Android) or Safari (iOS).
2.  **Android**: A prompt "Add XpanelERP to Home screen" should appear. If not, tap the three dots (menu) and select **Install app**.
3.  **iOS**: Tap the **Share** button (square with arrow) and scroll down to select **Add to Home Screen**.
4.  Launch the app from your home screen. You will notice the custom black splash screen and no browser address bar.

### Desktop (Chrome/Edge)

1.  Open your Odoo URL.
2.  In the address bar, look for the **Install Icon** (a computer with a down arrow).
3.  Click **Install**.
4.  The app will now run in a standalone window branded as XpanelERP.

---

## 3. Custom UI Features

### Sticky Footer Navigation

The module adds a permanent footer at the bottom of the screen:

- **Grid**: Instantly takes you back to the Odoo Home/App Switcher.
- **Timesheet**: Specialized shortcut to the Timesheets view.
- **AI / Analytics**: Placeholders for future features.
- **Back**: Custom history-aware back navigation.

### Visual Style

- **Solid Theme**: The UI is forced into a high-contrast Black & White style.
- **No Transparency**: All elements use solid backgrounds for a premium, app-like feel.
- **Custom Loading**: When refreshing or loading pages, you will see the black XpanelERP splash screen instead of the default Odoo spinner.

---

## 4. Troubleshooting

### PWA Not Installing?

- Ensure your Odoo instance is running over **HTTPS**. PWAs require a secure connection to register the Service Worker.
- If you are testing locally (localhost), the PWA should still work.

### CSS/JS Not Updating?

- If you make changes to the styles or logic, you may need to clear the Service Worker cache.
- In Chrome DevTools, go to **Application** -> **Service Workers** -> **Unregister**, then refresh the page.
- Alternatively, upgrade the module version in `__manifest__.py` and upgrade the module in the Odoo Apps menu.

### Home Menu Not Hidden?

- The module uses a `MutationObserver` to hide Odoo's default navigation elements. If they appear briefly, this is normal behavior for Odoo's SPA architecture. If they don't hide at all, check if your Odoo version uses different CSS classes for the navbar (default is `.o_main_navbar`).
