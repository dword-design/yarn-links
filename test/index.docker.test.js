import api from '../src'
import { spawn as _spawn } from 'child-process-promise'
import { outputFile } from 'fs-extra'
import userHome from 'user-home'
import { first, drop, split } from '@functions'

jest.setTimeout(10000)

const expectToEqual = right => left => expect(left).toEqual(right)
const spawn = (command, options) => () => command
  |> split(' ')
  |> parts => _spawn(parts |> first, parts |> drop(), options)
const writeToFile = filename => content => () => outputFile(filename, content)

test('empty', async () => undefined
  |> api
  |> await
  |> expectToEqual([])
)

test('two links', async () => undefined
  |> ('{ "name": "package-a" }' |> writeToFile(`${userHome}/package-a/package.json`))
  |> await
  |> spawn('yarn link', { cwd: `${userHome}/package-a` })
  |> await
  |> ('{ "name": "@vendor/package-b" }' |> writeToFile(`${userHome}/package-b/package.json`))
  |> await
  |> spawn('yarn link', { cwd: `${userHome}/package-b` })
  |> await
  |> api
  |> await
  |> expectToEqual(['@vendor/package-b', 'package-a'])
)
