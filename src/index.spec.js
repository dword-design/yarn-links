import execa from 'execa'
import { remove } from 'fs-extra'
import outputFiles from 'output-files'
import P from 'path'
import userHome from 'user-home'

import self from '.'

export default {
  empty: async () => expect(await self()).toEqual([]),
  'two links': async () => {
    await outputFiles(userHome, {
      'package-a/package.json': JSON.stringify({ name: 'package-a' }),
      'package-b/package.json': JSON.stringify({ name: '@vendor/package-b' }),
    })
    await execa.command('yarn link', { cwd: `${userHome}/package-a` })
    await execa.command('yarn link', { cwd: `${userHome}/package-b` })
    try {
      expect(await self()).toEqual(['@vendor/package-b', 'package-a'])
    } finally {
      await Promise.all([
        execa.command('yarn unlink', { cwd: P.resolve(userHome, 'package-a') }),
        execa.command('yarn unlink', { cwd: P.resolve(userHome, 'package-b') }),
      ])
      await Promise.all([
        remove(P.resolve(userHome, 'package-b')),
        remove(P.resolve(userHome, 'package-a')),
      ])
    }
  },
}
