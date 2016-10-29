import requireDir from "require-dir";
import _ from "lodash";
import buildConfig from "./config";

function evalTasks(wrap_func, gulp, compiled_config) {
    if (_.isFunction(wrap_func)) {
        wrap_func(gulp, compiled_config)
    } else {
        _.each(wrap_func, (f) => {
            evalTasks(f, gulp, compiled_config)
        })
    }
}

export default function initTasks(gulp, config, root) {
    const tasks = requireDir('./tasks', {recurse: true});
    config = _.merge({}, config, {envs: {root}});
    const compiled_config = buildConfig(config);
    evalTasks(tasks, gulp, compiled_config);
}