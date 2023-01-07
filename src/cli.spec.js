import { execa, execaCommand } from 'execa'
import { createRequire } from 'module'
import outputFiles from 'output-files'
import withLocalTmpDir from 'with-local-tmp-dir'

const _require = createRequire(import.meta.url)

export default {
  empty: async () => {
    const output = await execa(_require.resolve('./cli.js'), { all: true })
    expect(output.stdout).toEqual('')
  },
  valid: () =>
    withLocalTmpDir(async () => {
      await outputFiles({
        'package-a/package.json': JSON.stringify({ name: 'package-a' }),
        'package-b/package.json': JSON.stringify({ name: '@vendor/package-b' }),
        'package.json': JSON.stringify({ type: 'module' }),
      })
      await Promise.all([
        execaCommand('yarn link', { cwd: 'package-a' }),
        execaCommand('yarn link', { cwd: 'package-b' }),
      ])
      try {
        const output = await execa(_require.resolve('./cli.js'), { all: true })
        expect(output.all).toEqual('  - @vendor/package-b\n  - package-a')
      } finally {
        await Promise.all([
          execaCommand('yarn unlink', { cwd: 'package-a' }),
          execaCommand('yarn unlink', { cwd: 'package-b' }),
        ])
      }
    }),
}
