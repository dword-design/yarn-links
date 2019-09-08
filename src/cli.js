#!/usr/bin/env node

import getPackageNames from '.'
import { forIn, consoleLog } from '@functions'

(async () => getPackageNames()
  |> await
  |> forIn(consoleLog)
)()
