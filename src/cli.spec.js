import execa from 'execa'
import { remove } from 'fs-extra'
import outputFiles from 'output-files'
import P from 'path'
import userHome from 'user-home'

export default {
  empty: async () => {
    const output = await execa(require.resolve('./cli'), { all: true })
    expect(output.stdout).toEqual('')
  },
  valid: async () => {
    await outputFiles(userHome, {
      'package-a/package.json': JSON.stringify({ name: 'package-a' }),
      'package-b/package.json': JSON.stringify({ name: '@vendor/package-b' }),
    })
    await execa.command('yarn link', { cwd: `${userHome}/package-a` })
    await execa.command('yarn link', { cwd: `${userHome}/package-b` })
    try {
      const output = await execa(require.resolve('./cli'), { all: true })
      expect(output.all).toEqual('  - @vendor/package-b\n  - package-a')
    } finally {
      await Promise.all([
        (async () => {
          await execa.command('yarn unlink', {
            cwd: P.resolve(userHome, 'package-a'),
          })
          await remove(P.resolve(userHome, 'package-a'))
        })(),
        (async () => {
          await execa.command('yarn unlink', {
            cwd: P.resolve(userHome, 'package-b'),
          })
          await remove(P.resolve(userHome, 'package-b'))
        })(),
      ])
    }
  },
}
