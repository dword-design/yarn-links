import execa from 'execa'
import { remove } from 'fs-extra'
import outputFiles from 'output-files'
import P from 'path'
import withLocalTmpDir from 'with-local-tmp-dir'

import yarnLinksPath from './yarn-links-path'

export default {
  empty: async () => {
    const output = await execa(require.resolve('./cli'), { all: true })
    expect(output.stdout).toEqual('')
  },
  valid: () =>
    withLocalTmpDir(async () => {
      await outputFiles({
        'package-a/package.json': JSON.stringify({ name: 'package-a' }),
        'package-b/package.json': JSON.stringify({ name: '@vendor/package-b' }),
      })
      await Promise.all([
        execa.command('yarn link', { cwd: 'package-a' }),
        execa.command('yarn link', { cwd: 'package-b' }),
      ])
      try {
        const output = await execa(require.resolve('./cli'), { all: true })
        expect(output.all).toEqual('  - @vendor/package-b\n  - package-a')
      } finally {
        // yarn unlink currently does not work with GitHub Actions
        await Promise.all([
          remove(P.join(yarnLinksPath, '@vendor')),
          remove(P.join(yarnLinksPath, 'package-a')),
        ])
      }
    }),
}
