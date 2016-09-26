'use scrict';

var path = require('path');
var gutil = require('gulp-util');


function getEnvs() {
    var envs = {
        'type': gutil.env.type,
        'project': gutil.env.project || "example",
        'root': path.dirname(path.dirname(__dirname)),
    }
    envs.is_production = envs.type == 'production';
    envs.node_modules = path.join(envs.root, 'node_modules');
    return envs
}

module.exports = getEnvs();