import { spawn } from 'child-process-promise'
import expect from 'expect'

export default async () => {
  const { stdout } = await spawn('yarn-links', [], { capture: ['stdout'] })
  expect(stdout).toEqual('')
}
