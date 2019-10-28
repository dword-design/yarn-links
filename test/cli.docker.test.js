import userHome from 'user-home'
import P from 'path'
import { spawn } from 'child-process-promise'
import { removeFile } from 'fs-extra'
import outputFiles from 'output-files'

test('empty', async () => {
  const { stdout } = await spawn('yarn-links', { capture: ['stdout'] })
  expect(stdout).toEqual('')
})

test('two links', async () => {
  await outputFiles(userHome, {
    'package-a/package.json': JSON.stringify({ name: 'package-a' }),
    'package-b/package.json': JSON.stringify({ name: '@vendor/package-b' }),
  })
  await spawn('yarn', 'link', { cwd: `${userHome}/package-a` })
  await spawn('yarn', 'link', { cwd: `${userHome}/package-b` })
  const { stdout } = await spawn('yarn-links', { capture: ['stdout'] })
  expect(stdout).toEqual('@vendor/package-b\npackage-a\n')
  await Promise.all([
    (async () => {
      await spawn('yarn', 'unlink', { cwd: P.resolve(userHome, 'package-a') })
      await removeFile(P.resolve(userHome, 'package-a'))
    })(),
    (async () => {
      await spawn('yarn', 'unlink', { cwd: P.resolve(userHome, 'package-b') })
      await removeFile(P.resolve(userHome, 'package-b'))
    })(),
  ])
})
