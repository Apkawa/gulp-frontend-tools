import _ from 'lodash';
import path from "path";
import gutil from "gulp-util";


function getEnvs() {
    var envs = {
        'type': gutil.env.type,
        'project': gutil.env.project || "example",
        'lib_root': path.dirname(path.dirname(__dirname)),
    };
    envs = _.assign({}, gutil.env, envs);

    envs.is_production = (envs.type == 'production' || envs.production);
    envs.debug = !envs.is_production;

    return envs
}

module.exports = getEnvs();