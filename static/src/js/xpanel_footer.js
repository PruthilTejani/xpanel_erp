/** @odoo-module **/

(function () {
    'use strict';

    var SESSION_KEY = 'xpanel_back_depth';
    var GRID_OPENED_KEY = 'xpanel_grid_just_opened';
    var GRID_BOUNDARY_KEY = 'xpanel_grid_boundary';
    var TRACKING_KEY = 'xpanel_tracking_active';

    var _backDepth = parseInt(sessionStorage.getItem(SESSION_KEY) || '0', 10);
    var _gridOpenedTimer = null;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFooter);
    } else {
        initFooter();
    }

    function initFooter() {
        setTimeout(function () {
            setupFooterButtons();
            updateBackButtonState();
            if (window.location.hash === '#xpanel_grid' || window.location.hash === '#menu_id=root') {
                const menuToggle = document.querySelector('.o_menu_toggle, .o_navbar_apps_menu, .o_app_menu_toggle');
                if (menuToggle) menuToggle.click();
                history.replaceState(null, null, ' ');
            }
        }, 1500);
    }

    function updateBackButtonState() {
        var depth = parseInt(sessionStorage.getItem(SESSION_KEY) || '0', 10);
        var trackingActive = sessionStorage.getItem(TRACKING_KEY) === '1';
        var isDisabled = (trackingActive && depth <= 1) || (!trackingActive && depth <= 0);

        var backBtn = document.querySelector('#xpanel_footer [data-action="back"]');
        if (!backBtn) return;

        if (isDisabled) {
            backBtn.classList.add('xpanel-btn-disabled');
            backBtn.setAttribute('aria-disabled', 'true');
        } else {
            backBtn.classList.remove('xpanel-btn-disabled');
            backBtn.removeAttribute('aria-disabled');
        }
    }

    document.addEventListener('click', function (e) {
        var el = e.target;
        while (el && el !== document.body) {
            if (el.classList && (
                el.classList.contains('o_grid_apps_menu__button') ||
                el.classList.contains('o_menu_toggle') ||
                el.classList.contains('o_navbar_apps_menu') ||
                el.classList.contains('o_app_menu_toggle')
            )) {
                sessionStorage.setItem(GRID_OPENED_KEY, '1');

                if (_gridOpenedTimer) clearTimeout(_gridOpenedTimer);
                _gridOpenedTimer = setTimeout(function () {
                    sessionStorage.removeItem(GRID_OPENED_KEY);
                }, 15000);
                break;
            }
            el = el.parentElement;
        }
    }, true);

    var _originalPushState = history.pushState.bind(history);
    var _originalReplaceState = history.replaceState.bind(history);

    history.pushState = function (state, title, url) {
        if (sessionStorage.getItem(GRID_OPENED_KEY) === '1') {
            sessionStorage.removeItem(GRID_OPENED_KEY);
            if (_gridOpenedTimer) { clearTimeout(_gridOpenedTimer); _gridOpenedTimer = null; }

            _originalPushState({ [GRID_BOUNDARY_KEY]: true }, '', window.location.href);

            _backDepth = 0;
            sessionStorage.setItem(SESSION_KEY, '0');
            sessionStorage.setItem(TRACKING_KEY, '1');
        }

        _originalPushState(state, title, url);

        _backDepth++;
        sessionStorage.setItem(SESSION_KEY, _backDepth);

        setTimeout(setupFooterButtons, 300);
        setTimeout(updateBackButtonState, 350);
    };

    history.replaceState = function (state, title, url) {
        _originalReplaceState(state, title, url);
        setTimeout(setupFooterButtons, 300);
    };

    window.addEventListener('popstate', function (e) {
        if (e.state && e.state[GRID_BOUNDARY_KEY]) {
            window.history.forward();
        } else {
            _backDepth = parseInt(sessionStorage.getItem(SESSION_KEY) || '0', 10);
        }
        setTimeout(setupFooterButtons, 300);
        setTimeout(updateBackButtonState, 350);
    });

    function navigateBack() {
        _backDepth = parseInt(sessionStorage.getItem(SESSION_KEY) || '0', 10);
        var trackingActive = sessionStorage.getItem(TRACKING_KEY) === '1';
        if (trackingActive && _backDepth <= 1) {
            return;
        }

        if (!trackingActive && _backDepth <= 0) {
            return;
        }

        _backDepth--;
        sessionStorage.setItem(SESSION_KEY, _backDepth);
        setTimeout(updateBackButtonState, 100);
        window.history.back();
    }

    function setupFooterButtons() {
        const footer = document.getElementById('xpanel_footer');
        if (!footer) {
            setTimeout(setupFooterButtons, 500);
            return;
        }

        const buttons = footer.querySelectorAll('.xpanel-footer-btn');
        buttons.forEach(button => {
            const newBtn = button.cloneNode(true);
            button.parentNode.replaceChild(newBtn, button);

            newBtn.addEventListener('click', function (e) {
                e.preventDefault();
                const action = this.getAttribute('data-action');
                handleFooterAction(action);
            });
        });

        const consoleItems = footer.querySelectorAll('.xpanel-console-item');
        consoleItems.forEach(item => {
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            newItem.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const action = this.getAttribute('data-action');
                handleConsoleAction(action);
                document.getElementById('xpanel_console_menu')?.classList.remove('show');
            });
        });

        updateActiveState();
    }

    document.addEventListener('click', function(e) {
        const menu = document.getElementById('xpanel_console_menu');
        const footer = document.getElementById('xpanel_footer');
        if (!menu || !footer) return;
        
        const consoleBtn = footer.querySelector('[data-action="console"]');
        if (menu.classList.contains('show') && !menu.contains(e.target) && !consoleBtn?.contains(e.target)) {
            menu.classList.remove('show');
        }
    });

    function updateActiveState() {
        const footer = document.getElementById('xpanel_footer');
        if (!footer) return;

        const url = window.location.href;
        const hash = window.location.hash;
        const buttons = footer.querySelectorAll('.xpanel-footer-btn');
        
        buttons.forEach(btn => btn.classList.remove('active'));

        if (url.includes('hr_timesheet') || hash.includes('hr_timesheet')) {
            footer.querySelector('[data-action="worklogs"]')?.classList.add('active');
        } else if (url.includes('dashboards') || hash.includes('dashboards')) {
            footer.querySelector('[data-action="analytics"]')?.classList.add('active');
        }
    }

    function handleFooterAction(action) {
        switch (action) {
            case 'console':
                const menu = document.getElementById('xpanel_console_menu');
                if (menu) {
                    menu.classList.toggle('show');
                }
                break;
            case 'worklogs':
                window.location.href = '/web?action=hr_timesheet.act_hr_timesheet_line';
                break;
            case 'assistant':
                window.dispatchEvent(new CustomEvent('ai-copilot-toggle'));
                break;
            case 'analytics':
                window.location.href = '/odoo/dashboards';
                break;
            case 'back':
                navigateBack();
                break;
        }
        setTimeout(updateActiveState, 500);
    }

    function handleConsoleAction(action) {
        switch (action) {
            case 'ai_credits':
            case 'reporting':
            case 'drive':
                alert("This feature will be available soon. You will be notified once it is ready.");
                break;
        }
    }

    window.addEventListener('load', function () {
        setTimeout(setupFooterButtons, 1500);
        setTimeout(updateBackButtonState, 1600);
        setupNotificationBridge();
    });

    function setupNotificationBridge() {
        if (!('Notification' in window)) return;

        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.classList && (node.classList.contains('o_notification') || node.classList.contains('o_toast'))) {
                        tryShowSystemNotification(node);
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function tryShowSystemNotification(node) {
        if (Notification.permission !== 'granted') return;
        if (document.visibilityState === 'visible' && document.hasFocus()) return;

        const title = node.querySelector('.o_notification_title')?.innerText || 'XpanelERP';
        const body = node.querySelector('.o_notification_content')?.innerText ||
            node.querySelector('.o_toast_body')?.innerText ||
            'New message received';

        if (window.navigator && navigator.serviceWorker && navigator.serviceWorker.controller) {
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(title, {
                    body: body,
                    icon: '/pwa/static/src/img/xpanelerp.png',
                    tag: 'xpanelerp-notification',
                    renotify: true
                });
            });
        } else {
            new Notification(title, { body: body, icon: '/pwa/static/src/img/xpanelerp.png' });
        }
    }
})();