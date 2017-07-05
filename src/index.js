import _ from 'lodash'
import requireDir from 'require-dir'
import buildConfig from './config'

function evalTasks (wrap_func, gulp, compiled_config) {
  if (_.isFunction(wrap_func)) {
    wrap_func(gulp, compiled_config)
  } else {
    _.each(wrap_func, (f) => {
      evalTasks(f, gulp, compiled_config)
    })
  }
}

class Tools {
  constructor (gulp, config) {
    this.gulp = gulp
    this.raw_config = config
    this.tasks = this._collectTasks()
    this._configHook = []

  }

  _collectTasks () {
    return requireDir('./tasks', {recurse: true})
  }

  task (name, func) {
    this.tasks[name] = func
    return this
  }

  configHook (func) {
    this._configHook.push(func)
    return this
  }

  run () {
    let compiled_config = buildConfig(this.raw_config)
    for (let func of this._configHook) {
      compiled_config = func(compiled_config, this.raw_config)
    }
    evalTasks(this.tasks, this.gulp, compiled_config)
  }
}

export default (gulp, config) => new Tools(gulp, config)
