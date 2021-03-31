import execa from 'execa'
import globby from 'globby'
import outputFiles from 'output-files'
import P from 'path'
import withLocaltmpDir from 'with-local-tmp-dir'
import processOnSpawn from 'process-on-spawn'

import self from '.'
import yarnLinksPath from './yarn-links-path'

export default {
  empty: async () => expect(await self()).toEqual([]),
  'two links': () =>
    withLocaltmpDir(async () => {
      await outputFiles({
        'package-a/package.json': JSON.stringify({ name: 'package-a' }),
        'package-b/package.json': JSON.stringify({ name: '@vendor/package-b' }),
      })
      const removeSpawnWrap = opts => (opts.env.NODE_OPTIONS = '')
      processOnSpawn.addListener(removeSpawnWrap)
      await Promise.all([
        execa.command('yarn link', { cwd: 'package-a' }),
        execa.command('yarn link', { cwd: 'package-b' }),
      ])
      processOnSpawn.removeListener(removeSpawnWrap)
      /*await Promise.all([
        execa.command('yarn link', { cwd: 'package-a' }),
        execa.command('yarn link', { cwd: 'package-b' }),
      ])*/
      try {
        expect(await self()).toEqual(['@vendor/package-b', 'package-a'])
      } finally {
        // yarn unlink currently does not work with GitHub Actions
        /*await Promise.all([
          remove(P.join(yarnLinksPath, '@vendor')),
          remove(P.join(yarnLinksPath, 'package-a')),
        ])*/
      }
    }),
}
