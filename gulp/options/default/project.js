'use strict';

var envs = require('../../libs/envs');

var path = require('path');

var project_root = path.join(envs.root, envs.project);

var static_root = '/static/';

var app_root = project_root + '/app';
var dist_root = project_root + '/dist';

var template = {
    root: app_root + '/templates/',
    context: app_root + '/templates_context/',
};

var options = {
    project_root: project_root,
    static_root: static_root,
    node_modules: envs.node_modules,
    app_root: app_root,
    dist_root: dist_root,
    public_root: '{{ _.app_root }}/public/',
    path: {
        app: {
            css: '{{ _.app_root }}/styles/',
            js: '{{ _.app_root }}/scripts/',
            template: '{{ _.template.root }}/**/*',
            template_context: '{{ _.template.context }}/**/*',
            public_root: '{{ _.public_root }}',
            public: [
                '{{ _.public_root }}/**/*',
            ]
        },
        dist: {
            js: '{{ _.dist_root }}/js',
            css: '{{ _.dist_root }}/css',
        }
    },
    template: template,
    webpack: {
        entry_points: {}
    },
    browserSync: {
        proxy: {
            '/example': 'http://example.com/'
        },
        webpack: {
            public_path: '{{ _.static_root }}js'
        }
    },
};


module.exports = options;