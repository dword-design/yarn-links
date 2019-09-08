import api from '../dist'
import userHome from 'user-home'
import { writeToFile, spawn, removeFile } from '@lib'
import { expectToEqual } from '@test'
import { resolve } from 'path'

test('empty', async () => undefined
  |> api
  |> await
  |> expectToEqual([])
)

test('two links', async () => undefined
  |> ('{ "name": "package-a" }' |> writeToFile(resolve(userHome, 'package-a/package.json'))) |> await
  |> spawn('yarn link', { cwd: resolve(userHome, 'package-a') }) |> await
  |> ('{ "name": "@vendor/package-b" }' |> writeToFile(resolve(userHome, 'package-b/package.json'))) |> await
  |> spawn('yarn link', { cwd: resolve(userHome, 'package-b') }) |> await
  |> api |> await
  |> expectToEqual(['@vendor/package-b', 'package-a'])
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
