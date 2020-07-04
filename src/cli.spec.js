import execa from 'execa'
import { remove } from 'fs-extra'
import outputFiles from 'output-files'
import withLocalTmpDir from 'with-local-tmp-dir'

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
      await execa.command('yarn link', { cwd: 'package-a' })
      await execa.command('yarn link', { cwd: 'package-b' })
      try {
        const output = await execa(require.resolve('./cli'), { all: true })
        expect(output.all).toEqual('  - @vendor/package-b\n  - package-a')
      } finally {
        await Promise.all([
          (async () => {
            await execa.command('yarn unlink', {
              cwd: 'package-a',
            })
            await remove('package-a')
          })(),
          (async () => {
            await execa.command('yarn unlink', {
              cwd: 'package-b',
            })
            await remove('package-b')
          })(),
        ])
      }
    }),
}
