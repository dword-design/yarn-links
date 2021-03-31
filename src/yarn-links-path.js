import execa from 'execa'
import P from 'path'

export default P.resolve(
  execa.commandSync('yarn global dir').stdout,
  '..',
  'link'
)
