import execa from 'execa'
import { readlink, remove } from 'fs-extra'
import globby from 'globby'
import outputFiles from 'output-files'
import P from 'path'
import withLocaltmpDir from 'with-local-tmp-dir'

import self from '.'
import yarnLinksPath from './yarn-links-path'

export default {
  empty: async () => expect(await self()).toEqual([]),
  'two links': () =>
    withLocaltmpDir(async () => {
      await outputFiles({
        foo: {},
        'package-a': {
          'index.js': '',
          'package.json': JSON.stringify({ name: 'package-a' }),
        },
        'package-b/package.json': JSON.stringify({ name: '@vendor/package-b' }),
      })
      await Promise.all([
        execa.command('yarn link', { cwd: 'package-a' }),
        execa.command('yarn link', { cwd: 'package-b' }),
      ])
      process.chdir('foo')
      await execa.command('yarn init -y')
      // console.log(execa.command('yarn global dir') |> property('stdout') |> JSON.stringify)
      // console.log(await globby('**', { cwd: '/usr/local/share/.config/yarn/global', onlyFiles: false }))
      await execa.command('yarn link package-a', { stdio: 'inherit' })
      console.log(
        await globby('**', {
          dot: true,
          onlyFiles: false,
        })
      )
      console.log(await readlink('node_modules/package-a'))
      // await execa('ls', ['-la'], { cwd: 'node_modules' })
      try {
        expect(await self()).toEqual(['@vendor/package-b', 'package-a'])
      } finally {
        // yarn unlink currently does not work with GitHub Actions
        await Promise.all([
          remove(P.join(await yarnLinksPath(), '@vendor')),
          remove(P.join(await yarnLinksPath(), 'package-a')),
        ])
      }
    }),
}
