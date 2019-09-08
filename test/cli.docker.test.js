import userHome from 'user-home'
import { writeToFile, removeFile, spawn } from '@lib'
import { expectToEqual } from '@test'
import { resolve } from 'path'

test('empty', async () => undefined
  |> spawn(require.resolve('../dist/cli'), { capture: ['stdout'] }) |> await
  |> ({ stdout }) => stdout |> expectToEqual('')
)

test('two links', async () => undefined
  |> ('{ "name": "package-a" }' |> writeToFile(`${userHome}/package-a/package.json`)) |> await
  |> spawn('yarn link', { cwd: `${userHome}/package-a` }) |> await
  |> ('{ "name": "@vendor/package-b" }' |> writeToFile(`${userHome}/package-b/package.json`)) |> await
  |> spawn('yarn link', { cwd: `${userHome}/package-b` }) |> await
  |> spawn(require.resolve('../dist/cli'), { capture: ['stdout'] }) |> await
  |> ({ stdout }) => stdout |> expectToEqual('@vendor/package-b\npackage-a\n')
  |> () => Promise.all([
    (async () => undefined
      |> spawn('yarn unlink', { cwd: resolve(userHome, 'package-a') }) |> await
      |> (resolve(userHome, 'package-a') |> removeFile)
    )(),
    (async () => undefined
      |> spawn('yarn unlink', { cwd: resolve(userHome, 'package-b') }) |> await
      |> (resolve(userHome, 'package-b') |> removeFile)
    )(),
  ])
)
