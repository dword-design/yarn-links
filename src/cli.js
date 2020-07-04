#!/usr/bin/env node

import { join, map } from '@dword-design/functions'

import api from '.'

const run = async () => {
  const links = await api()
  if (links.length > 0) {
    console.log(links |> map(link => `  - ${link}`) |> join('\n'))
  }
}
run()
