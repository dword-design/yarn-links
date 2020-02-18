import api from '.'
import userHome from 'user-home'
import P from 'path'
import outputFiles from 'output-files'
import execa from 'execa'
import { remove } from 'fs-extra'

export default {
  empty: async () => expect(await api()).toEqual([]),
  'two links': async () => {
    await outputFiles(userHome, {
      'package-a/package.json': JSON.stringify({ name: 'package-a' }),
      'package-b/package.json': JSON.stringify({ name: '@vendor/package-b' }),
    })
    await execa.command('yarn link', { cwd: P.resolve(userHome, 'package-a') })
    await execa.command('yarn link', { cwd: P.resolve(userHome, 'package-b') })
    try {
      expect(await api()).toEqual(['@vendor/package-b', 'package-a'])
    } finally {
      await Promise.all([
        (async () => {
          await execa.command('yarn unlink', { cwd: P.resolve(userHome, 'package-a') })
          await remove(P.resolve(userHome, 'package-a'))
        })(),
        (async () => {
          await execa.command('yarn unlink', { cwd: P.resolve(userHome, 'package-b') })
          await remove(P.resolve(userHome, 'package-b'))
        })(),
      ])
    }
  },
}
