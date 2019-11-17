import { spawn } from 'child_process'
import expect from 'expect'

export default async () => {
  const { stdout } = await spawn('yarn-links', [], { capture: ['stdout'] })
  expect(stdout).toEqual('')
}
