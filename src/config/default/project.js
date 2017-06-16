'use strict';
import envs from "../../libs/envs";


var options = {
    project_root: '{{ envs.root }}',
    static_root: '/static/',
    app_root: '{{ _.project_root }}/app',
    dist_root: '{{ _.project_root }}/dist',
    path: {
        node_modules: '{{ envs.root }}/node_modules/',
        app: {
            css: '{{ _.app_root }}/styles/',
            scss: '{{ _.path.app.css }}',
            images: '{{ _.app_root }}/images/',
            js: '{{ _.app_root }}/scripts/',
            template: '{{ _.template.root }}/',
            template_context: '{{ _.template.context }}/',
            public: [
                '{{ _.app_root }}/public/',
            ]
        },
        dist: {
            js: '{{ _.dist_root }}/js',
            css: '{{ _.dist_root }}/css',
            img: '{{ _.dist_root }}/img',
            source_maps: '{{ _.dist_root }}/_maps/'
        }
    },
    template: {
        root: '{{ _.app_root }}/templates/',
        context: '{{ _.app_root }}/templates_context/',
        dist: '{{ _.dist_root }}/templates/',
    },
    webpack: {
        entry_points: {},
        publicPath: '{{ _.static_root }}js/',
        modules: [],
        defines: {
            'STATIC_ROOT': '"{{ project.static_root }}"',
        },
        eslint: false,
        extract_css: {
            filename: 'common.css',
            options: {
                allChunks: true,
            },

        },
    },
    browserSync: {
        proxy: {
            '/example': 'http://example.com/'
        },
        webpack: {
            public_path: '{{ _.static_root }}js'
        }
    },
    sprite: {
        // a entry point
        sprites: {
            root: '{{ _.path.app.images }}/', // with append key name
            imgRoot: '{{ _.static_root }}/img/',
            spriteRoot: '{{ _.path.app.public[0] }}/img/',
            suffix: 'icons-'
        }
    },
    sass: {
        includePaths: [
            '{{ _.path.app.scss }}',
            '{{ _.path.node_modules }}'
        ],
    },
    'sass-image': {
        images: {
            root: '{{ _.path.app.public[0] }}/img/',
            http_images_path: '{{ _.static_root }}/img/',
            base64: false,
            suffix: 'img-'
        }
    },
    scss_lint: {
        'config': '{{ envs.lib_root }}/.scss-lint.yml',
        'maxBuffer': 2048 * 1024
    },
    context: {
        'STATIC_ROOT': '{{ project.static_root }}',
    },
    eslint: {
        configFile: '{{ envs.lib_root }}/.eslintrc'
    }
};


module.exports = options;