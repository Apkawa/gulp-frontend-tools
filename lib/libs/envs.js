'use strict';
'use scrict';

var path = require('path');
var gutil = require('gulp-util');

function getEnvs() {
    var envs = {
        'type': gutil.env.type,
        'project': gutil.env.project || "example",
        'lib_root': path.dirname(path.dirname(__dirname))
    };
    envs.is_production = envs.type == 'production';
    return envs;
}

module.exports = getEnvs();