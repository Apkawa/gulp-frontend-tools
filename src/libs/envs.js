import path from 'path'
import gutil from 'gulp-util'

const nodeEnv = process.env.NODE_ENV

function getEnvs () {
  root = process.cwd()
  const lib_root = path.dirname(path.dirname(__dirname))

  let {_, ...envs} = gutil.env

  envs = {
    ...envs,
    lib_root,
    root,
  }

  envs.is_production = (
    envs.type === 'production'
    || nodeEnv === 'production'
    || Boolean(gutil.env.production)
  )
  envs.debug = !envs.is_production
  return envs
}

export default getEnvs()
