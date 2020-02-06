import { spawn } from 'child-process-promise'

export default async () => {
  const { stdout } = await spawn('yarn-links', [], { capture: ['stdout'] })
  expect(stdout).toEqual('')
}
