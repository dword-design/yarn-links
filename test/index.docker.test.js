import api from '../src'
import userHome from 'user-home'
import { writeToFile, spawn } from '@lib'

jest.setTimeout(10000)

const expectToEqual = right => left => expect(left).toEqual(right)

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
