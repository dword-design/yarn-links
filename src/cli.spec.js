import execa from 'execa'
import outputFiles from 'output-files'
import processOnSpawn from 'process-on-spawn'
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

      const removeSpawnWrap = opts => (opts.env.NODE_OPTIONS = '')
      processOnSpawn.addListener(removeSpawnWrap)
      await Promise.all([
        execa.command('yarn link', { cwd: 'package-a' }),
        execa.command('yarn link', { cwd: 'package-b' }),
      ])
      processOnSpawn.removeListener(removeSpawnWrap)
      try {
        const output = await execa(require.resolve('./cli'), { all: true })
        expect(output.all).toEqual('  - @vendor/package-b\n  - package-a')
      } finally {
        await Promise.all([
          execa.command('yarn unlink', { cwd: 'package-a' }),
          execa.command('yarn unlink', { cwd: 'package-b' }),
        ])
      }
    }),
}
