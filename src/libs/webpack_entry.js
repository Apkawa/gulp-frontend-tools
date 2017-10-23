import collect_filenames from './collect_filenames'

export default function getWebpackEntry (config) {
  const webpackOptions = config.webpack
  const {
    entry_root: entryRoot,
    entry_points: extraEntryPoints
  } = webpackOptions
  const entryPoints = collect_filenames(entryRoot, '**/*.js?(x)')
  return {
    ...entryPoints,
    ...webpackOptions.entry,
    ...extraEntryPoints
  }
}
