import execa from 'execa'
import P from 'path'

export default async () => P.resolve(
  (await execa.command('yarn global dir')).stdout,
  '..',
  'link'
)
