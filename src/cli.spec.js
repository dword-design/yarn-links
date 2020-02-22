import withLocalTmpDir from 'with-local-tmp-dir'
import execa from 'execa'
import outputFiles from 'output-files'
import { endent } from '@dword-design/functions'

export default {
  empty: async () => {
    const { all } = await execa.command('yarn-links', { all: true })
    expect(all).toEqual('')
  },
  'two links': () => withLocalTmpDir(async () => {
    await outputFiles({
      'package-a/package.json': JSON.stringify({ name: 'package-a' }),
      'package-b/package.json': JSON.stringify({ name: '@vendor/package-b' }),
    })
    await Promise.all([
      execa.command('yarn link', { cwd: 'package-a' }),
      execa.command('yarn link', { cwd: 'package-b' }),
    ])
    try {
      const { all } = await execa.command('yarn-links', { all: true })
      expect(all).toEqual(endent`
        - @vendor/package-b
        - package-a
      `)
    } finally {
      await Promise.all([
        execa.command('yarn unlink', { cwd: 'package-a' }),
        execa.command('yarn unlink', { cwd: 'package-b' }),
      ])
    }
  }),
}
