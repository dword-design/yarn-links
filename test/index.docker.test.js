import yarnLinks from '@dword-design/yarn-links'
import userHome from 'user-home'
import P from 'path'
import outputFiles from 'output-files'
import { spawn } from 'child_process'
import { remove } from 'fs'

describe('index', () => {

  it('empty', async () => expect(await yarnLinks()).toEqual([]))

  it('two links', async () => {
    await outputFiles(userHome, {
      'package-a/package.json': JSON.stringify({ name: 'package-a' }),
      'package-b/package.json': JSON.stringify({ name: '@vendor/package-b' }),
    })
    await spawn('yarn', ['link'], { cwd: `${userHome}/package-a` })
    await spawn('yarn', ['link'], { cwd: `${userHome}/package-b` })
    try {
      expect(await yarnLinks()).toEqual(['@vendor/package-b', 'package-a'])
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
