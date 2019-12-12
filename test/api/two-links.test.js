import api from 'yarn-links'
import userHome from 'user-home'
import { resolve } from 'path'
import outputFiles from 'output-files'
import { spawn } from 'child-process-promise'
import { remove } from 'fs-extra'
import expect from 'expect'

export const it = async () => {
  await outputFiles(userHome, {
    'package-a/package.json': JSON.stringify({ name: 'package-a' }),
    'package-b/package.json': JSON.stringify({ name: '@vendor/package-b' }),
  })
  await spawn('yarn', ['link'], { cwd: `${userHome}/package-a` })
  await spawn('yarn', ['link'], { cwd: `${userHome}/package-b` })
  try {
    expect(await api()).toEqual(['@vendor/package-b', 'package-a'])
  } finally {
    await Promise.all([
      (async () => {
        await spawn('yarn', ['unlink'], { cwd: resolve(userHome, 'package-a') })
        await remove(resolve(userHome, 'package-a'))
      })(),
      (async () => {
        await spawn('yarn', ['unlink'], { cwd: resolve(userHome, 'package-b') })
        await remove(resolve(userHome, 'package-b'))
      })(),
    ])
  }
}

export const timeout = 8000
