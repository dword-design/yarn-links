import globalDirs from 'global-dirs'
import P from 'path'
import yarnConfigDirectory from 'yarn-config-directory'

export default P.join(
  process.platform === 'win32'
    ? P.resolve(globalDirs.yarn.packages, '..', '..')
    : yarnConfigDirectory(),
  'link'
)
