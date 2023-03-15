import {
  filterAsync,
  identity,
  map,
  promiseAll,
  sortBy,
  unary,
} from '@dword-design/functions'
import fs from 'fs-extra'
import { globby } from 'globby'
import P from 'path'

import yarnLinksPath from './yarn-links-path.js'

export default async () => {
  const candidates =
    globby('**', {
      absolute: true,
      cwd: yarnLinksPath,
      onlyDirectories: true,
    })
    |> await
    |> sortBy(identity)

  const symlinks =
    candidates
    |> filterAsync(async candidate =>
      (fs.lstat(candidate) |> await).isSymbolicLink(),
    )
    |> await

  const packagePaths =
    symlinks |> map(unary(fs.realpath)) |> promiseAll |> await

  const packageJsons =
    packagePaths |> map(path => P.resolve(path, 'package.json'))

  const packages =
    packageJsons |> map(unary(fs.readJson)) |> promiseAll |> await

  return packages |> map('name')
}
