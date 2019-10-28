#!/usr/bin/env node

import yarnLinks from '@dword-design/yarn-links'
import { forIn, unary } from '@functions'

(async () => yarnLinks() |> await |> forIn(unary(console.log)))()
