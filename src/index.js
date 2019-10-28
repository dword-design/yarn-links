import glob from 'glob-promise'
import { readJson, realpath, lstat } from 'fs-extra'
import { map, invoke, unary, promiseAll, filterAsync } from '@functions'
import P from 'path'
import getYarnPrefix from 'yarn-config-directory'

export default async () => {
  const candidates = await glob(`${getYarnPrefix()}/**`)
  const symlinks = await candidates |> filterAsync(async packagePath => packagePath |> lstat |> await |> invoke('isSymbolicLink'))
  const packagePaths = await symlinks |> map(unary(realpath)) |> promiseAll
  const packageJsons = packagePaths |> map(path => P.resolve(path, 'package.json'))
  const packages = await packageJsons |> map(unary(readJson)) |> promiseAll
  return packages |> map('name')
}
