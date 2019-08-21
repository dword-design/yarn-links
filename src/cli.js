import getPackageNames from '.'
import { forIn } from '@functions'

getPackageNames()
  .then(forIn(packageName => console.log(packageName)))
