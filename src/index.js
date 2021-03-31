import {
  filterAsync,
  identity,
  map,
  promiseAll,
  sortBy,
  unary,
} from '@dword-design/functions'
import { lstat, readJson, realpath } from 'fs-extra'
import globby from 'globby'
import P from 'path'

import yarnLinksPath from './yarn-links-path'

export default async () => {
  console.log(yarnLinksPath)

  const candidates =
    globby('**', {
      absolute: true,
      cwd: await yarnLinksPath(),
      onlyDirectories: true,
    })
    |> await
    |> sortBy(identity)

  const symlinks =
    candidates
    |> filterAsync(async candidate =>
      (lstat(candidate) |> await).isSymbolicLink()
    )
    |> await
  console.log(
    await globby('**', {
      cwd: yarnLinksPath,
      onlyFiles: false,
    })
  )
  console.log(candidates)
  console.log(symlinks)

  const packagePaths = symlinks |> map(unary(realpath)) |> promiseAll |> await

  const packageJsons =
    packagePaths |> map(path => P.resolve(path, 'package.json'))

  const packages = packageJsons |> map(unary(readJson)) |> promiseAll |> await

  return packages |> map('name')
}
