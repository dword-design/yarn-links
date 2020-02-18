import userHome from 'user-home'
import execa from 'execa'
import { remove } from 'fs-extra'
import outputFiles from 'output-files'
import P from 'path'

export default {
  empty: async () => {
    const { all } = await execa.command('yarn-links', { all: true })
    expect(all).toEqual('')
  },
  'two links': async () => {
    await outputFiles(userHome, {
      'package-a/package.json': JSON.stringify({ name: 'package-a' }),
      'package-b/package.json': JSON.stringify({ name: '@vendor/package-b' }),
    })
    await execa.command('yarn link', { cwd: P.resolve(userHome, 'package-a') })
    await execa.command('yarn link', { cwd: P.resolve(userHome, 'package-b') })
    try {
      const { all } = await execa.command('yarn-links', { all: true })
      expect(all).toEqual('  - @vendor/package-b\n  - package-a')
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
