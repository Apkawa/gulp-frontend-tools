import _ from 'lodash'
import path from 'path'
import gutil from 'gulp-util'

function getEnvs () {
  const lib_root = path.dirname(path.dirname(__dirname))

  let { ...envs, _} = gutil.env
  envs = {
    ...envs,
    lib_root
  }

  console.log(gutil.env)
  envs.is_production = (envs.type === 'production' || Boolean(gutil.env.production))
  envs.debug = !envs.is_production

  return envs
}

module.exports = getEnvs()
