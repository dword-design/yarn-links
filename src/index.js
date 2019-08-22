import glob from 'glob-promise'
import userHome from 'user-home'
import { readJson, realpath, lstat } from 'fs-extra'
import { map, filter, invoke, unary, promiseAll } from '@functions'
import { resolve as _resolve } from 'path'

const resolve = (...paths) => path => _resolve(path, ...paths)

const filterAsync = callback => async collection => collection
  |> map(callback) |> promiseAll |> await
  |> (filterResults => collection |> filter((element, index) => filterResults[index]))

export default async () => glob(`${userHome}/.config/yarn/link/**`) |> await
  |> filterAsync(async packagePath => packagePath |> lstat |> await |> invoke('isSymbolicLink')) |> await
  |> map(realpath |> unary) |> promiseAll |> await
  |> map(resolve('package.json'))
  |> map(readJson |> unary) |> promiseAll |> await
  |> map('name')
