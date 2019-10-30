import userHome from 'user-home'
import P from 'path'
import { spawn } from 'child_process'
import { remove } from 'fs'
import outputFiles from 'output-files'

describe('cli', () => {

  it('empty', async () => {
    const { stdout } = await spawn('yarn-links', [], { capture: ['stdout'] })
    expect(stdout).toEqual('')
  })

  it('two links', async () => {
    await outputFiles(userHome, {
      'package-a/package.json': JSON.stringify({ name: 'package-a' }),
      'package-b/package.json': JSON.stringify({ name: '@vendor/package-b' }),
    })
    await spawn('yarn', ['link'], { cwd: `${userHome}/package-a` })
    await spawn('yarn', ['link'], { cwd: `${userHome}/package-b` })
    try {
      const { stdout } = await spawn('yarn-links', [], { capture: ['stdout'] })
      expect(stdout).toEqual('@vendor/package-b\npackage-a\n')
    } finally {
      await Promise.all([
        (async () => {
          await spawn('yarn', ['unlink'], { cwd: P.resolve(userHome, 'package-a') })
          await remove(P.resolve(userHome, 'package-a'))
        })(),
        (async () => {
          await spawn('yarn', ['unlink'], { cwd: P.resolve(userHome, 'package-b') })
          await remove(P.resolve(userHome, 'package-b'))
        })(),
      ])
    }
  }).timeout(5000)
})
