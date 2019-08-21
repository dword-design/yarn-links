import glob from 'glob-promise'
import userHome from 'user-home'
import { readJson, realpath, lstat } from 'fs-extra'
import { map, filter } from '@functions'
import { unary } from 'lodash/fp'
import { resolve } from 'path'

const promiseAll = promises => Promise.all(promises)

export default async () => glob(`${userHome}/.config/yarn/link/**`) |> await
  |> (async packagePaths => packagePaths
    |> map(lstat |> unary) |> promiseAll |> await
    |> (stats => packagePaths |> filter((packagePath, index) => stats[index].isSymbolicLink()))
  ) |> await
  |> map(realpath |> unary) |> promiseAll |> await
  |> map(resolvedPath => readJson(resolve(resolvedPath, 'package.json'))) |> promiseAll |> await
  |> map('name')
