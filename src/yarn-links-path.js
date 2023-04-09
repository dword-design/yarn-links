import { execaCommandSync } from 'execa'
import P from 'path'

export default P.resolve(
  execaCommandSync('yarn global dir').stdout,
  '..',
  'link',
)
