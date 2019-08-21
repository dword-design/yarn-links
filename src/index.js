import glob from 'glob-promise'
import userHome from 'user-home'
import fs from 'fs-extra'
import { map, filter } from '@functions'
import path from 'path'

export default () => glob(`${userHome}/.config/yarn/link/**`)
  .then(packagePaths => Promise.all(packagePaths |> map(packagePath => fs.lstat(packagePath)))
    .then(stats => packagePaths |> filter((packagePath, index) => stats[index].isSymbolicLink()))
  )
  .then(packagePaths => Promise.all(packagePaths |> map(packagePath => fs.realpath(packagePath))))
  .then(packagePaths => Promise.all(packagePaths |> map(packagePath => fs.readJson(path.resolve(packagePath, 'package.json')))))
  .then(map('name'))
