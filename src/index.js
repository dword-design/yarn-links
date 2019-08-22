import glob from 'glob-promise'
import userHome from 'user-home'
import { readJson, realpath, lstat } from 'fs-extra'
import { map, invoke, unary, promiseAll, filterAsync } from '@functions'
import { resolve as _resolve } from 'path'

const resolve = (...paths) => path => _resolve(path, ...paths)

export default async () => glob(`${userHome}/.config/yarn/link/**`) |> await
  |> filterAsync(async packagePath => packagePath |> lstat |> await |> invoke('isSymbolicLink')) |> await
  |> map(realpath |> unary) |> promiseAll |> await
  |> map(resolve('package.json'))
  |> map(readJson |> unary) |> promiseAll |> await
  |> map('name')
