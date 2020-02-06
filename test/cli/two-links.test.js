import userHome from 'user-home'
import { spawn } from 'child-process-promise'
import { remove } from 'fs-extra'
import outputFiles from 'output-files'
import { resolve } from 'path'

export default async () => {
  await outputFiles(userHome, {
    'package-a/package.json': JSON.stringify({ name: 'package-a' }),
    'package-b/package.json': JSON.stringify({ name: '@vendor/package-b' }),
  })
  await spawn('yarn', ['link'], { cwd: `${userHome}/package-a` })
  await spawn('yarn', ['link'], { cwd: `${userHome}/package-b` })
  try {
    const { stdout } = await spawn('yarn-links', [], { capture: ['stdout'] })
    expect(stdout).toEqual('  - @vendor/package-b\n  - package-a\n')
  } finally {
    await Promise.all([
      (async () => {
        await spawn('yarn', ['unlink'], { cwd: resolve(userHome, 'package-a') })
        await remove(resolve(userHome, 'package-a'))
      })(),
      (async () => {
        await spawn('yarn', ['unlink'], { cwd: resolve(userHome, 'package-b') })
        await remove(resolve(userHome, 'package-b'))
      })(),
    ])
  }
}
