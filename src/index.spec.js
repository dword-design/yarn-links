import api from '.'
import withLocalTmpDir from 'with-local-tmp-dir'
import outputFiles from 'output-files'
import execa from 'execa'

export default {
  empty: async () => expect(await api()).toEqual([]),
  'two links': withLocalTmpDir(async () => {
    await outputFiles({
      'package-a/package.json': JSON.stringify({ name: 'package-a' }),
      'package-b/package.json': JSON.stringify({ name: '@vendor/package-b' }),
    })
    await Promise.all([
      execa.command('yarn link', { cwd: 'package-a' }),
      execa.command('yarn link', { cwd: 'package-b' }),
    ])
    try {
      expect(await api()).toEqual(['@vendor/package-b', 'package-a'])
    } finally {
      await Promise.all([
        execa.command('yarn unlink', { cwd: 'package-a' }),
        execa.command('yarn unlink', { cwd: 'package-b' }),
      ])
    }
  }),
}
