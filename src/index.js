import glob from 'glob-promise'
import { readJson, realpath, lstat } from 'fs-extra'
import { map, invoke, unary, promiseAll, filterAsync } from '@functions'
import { resolve as _resolve } from 'path'
import { yarn as yarnDirs } from 'global-dirs'

const resolve = (...paths) => path => _resolve(path, ...paths)

export default async () => glob(`${yarnDirs.prefix}/link/**`) |> await
  |> filterAsync(async packagePath => packagePath |> lstat |> await |> invoke('isSymbolicLink')) |> await
  |> map(realpath |> unary) |> promiseAll |> await
  |> map(resolve('package.json'))
  |> map(readJson |> unary) |> promiseAll |> await
  |> map('name')
