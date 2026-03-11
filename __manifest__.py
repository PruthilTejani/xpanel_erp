# -*- coding: utf-8 -*-
{
    'name': 'PWA',
    'version': '1.0.0',
    'category': 'Web',
    'summary': 'Progressive Web App wrapper and UI customization',
    'description': """
        PWA Module
        ====================
        - Makes Odoo installable as a PWA
        - Custom loading/splash screen
        - Sticky footer navigation bar
        - Black & white solid UI
        - Mobile and desktop support
    """,
    'author': 'Pruthil Tejani',
    'depends': ['web', 'hr_timesheet', 'website'],
    'data': [
        'views/templates.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'pwa/static/src/css/xpanel_footer.css',
            'pwa/static/src/css/loading.css',
            'pwa/static/src/js/xpanel_footer.js',
        ],
        'web.assets_frontend': [
            'pwa/static/src/css/xpanel_footer.css',
            'pwa/static/src/css/loading.css',
            'pwa/static/src/js/xpanel_footer.js',
        ],
    },
    'installable': True,
    'application': True,
    'auto_install': False,
    'license': 'LGPL-3',
}
