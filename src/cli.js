#!/usr/bin/env node

import api from '.'
import { map, join } from '@functions'

(async () => {
  const links = await api()
  if (links.length > 0) {
    console.log(links |> map(link => `  - ${link}`) |> join('\n'))
  }
})()
