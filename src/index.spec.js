import { execaCommand } from 'execa'
import outputFiles from 'output-files'
import processOnSpawn from 'process-on-spawn'
import withLocaltmpDir from 'with-local-tmp-dir'

import self from './index.js'

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
        execaCommand('yarn link', { cwd: 'package-a' }),
        execaCommand('yarn link', { cwd: 'package-b' }),
      ])
      processOnSpawn.removeListener(removeSpawnWrap)
      try {
        expect(await self()).toEqual(['@vendor/package-b', 'package-a'])
      } finally {
        await Promise.all([
          execaCommand('yarn unlink', { cwd: 'package-a' }),
          execaCommand('yarn unlink', { cwd: 'package-b' }),
        ])
      }
    }),
}
