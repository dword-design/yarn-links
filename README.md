<!-- TITLE/ -->
# yarn-links
<!-- /TITLE -->

<!-- BADGES/ -->
[![NPM version](https://img.shields.io/npm/v/yarn-links.svg)](https://npmjs.org/package/yarn-links)
![Linux macOS Windows compatible](https://img.shields.io/badge/os-linux%20%7C%C2%A0macos%20%7C%C2%A0windows-blue)

[![Build status](https://img.shields.io/github/workflow/status/dword-design/yarn-links/build)](https://github.com/dword-design/yarn-links/actions)
[![Coverage status](https://img.shields.io/coveralls/dword-design/yarn-links)](https://coveralls.io/github/dword-design/yarn-links)
[![Dependency status](https://img.shields.io/david/dword-design/yarn-links)](https://david-dm.org/dword-design/yarn-links)
![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen)

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/dword-design/yarn-links)
<!-- /BADGES -->

<!-- DESCRIPTION/ -->
This package outputs all linked yarn packages via the CLI or via an exported function.
<!-- /DESCRIPTION -->

<!-- INSTALL/ -->
# Install

```bash
# NPM
$ npm install yarn-links

# Yarn
$ yarn add yarn-links
```
<!-- /INSTALL -->

# CLI Usage

```bash
$ yarn-links
  - http-server
  - npm-name-cli
```

# API Usage

```js
const yarnLinks = require('yarn-links')

const links = await yarnLinks()
// ['http-server', 'npm-name-cli']
```

<!-- LICENSE/ -->
# License

Unless stated otherwise all works are:

Copyright &copy; Sebastian Landwehr <info@dword-design.de>

and licensed under:

[MIT License](https://opensource.org/licenses/MIT)
<!-- /LICENSE -->
