import execa from 'execa'
import outputFiles from 'output-files'
import withLocaltmpDir from 'with-local-tmp-dir'

import self from '.'

export default {
  empty: async () => expect(await self()).toEqual([]),
  'two links': () =>
    withLocaltmpDir(async () => {
      await outputFiles({
        'package-a/package.json': JSON.stringify({ name: 'package-a' }),
        'package-b/package.json': JSON.stringify({ name: '@vendor/package-b' }),
      })
      await execa.command('yarn link', { cwd: 'package-a' })
      await execa.command('yarn link', { cwd: 'package-b' })
      try {
        expect(await self()).toEqual(['@vendor/package-b', 'package-a'])
      } finally {
        execa.command('yarn unlink', { cwd: 'package-a' })
        execa.command('yarn unlink', { cwd: 'package-b' })
      }
    }),
}
