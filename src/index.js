import glob from 'glob-promise'
import { readJson, realpath, lstat } from 'fs-extra'
import { map, unary, promiseAll, filterAsync } from '@dword-design/functions'
import P from 'path'
import getYarnPrefix from 'yarn-config-directory'

export default async () => {
  const candidates = await glob(`${getYarnPrefix()}/**`)
  const symlinks = candidates |> filterAsync(async candidate => (lstat(candidate) |> await).isSymbolicLink()) |> await
  const packagePaths = symlinks |> map(unary(realpath)) |> promiseAll |> await
  const packageJsons = packagePaths |> map(path => P.resolve(path, 'package.json'))
  const packages = packageJsons |> map(unary(readJson)) |> promiseAll |> await
  return packages |> map('name')
}
