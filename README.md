<!--@h1([pkg.name])-->
# yarn-links
<!--/@-->

<!--@shields('npm', 'travis', 'coveralls', 'deps')-->
[![npm version](https://img.shields.io/npm/v/yarn-links.svg)](https://www.npmjs.com/package/yarn-links) [![Build Status](https://img.shields.io/travis/dword-design/yarn-links/master.svg)](https://travis-ci.org/dword-design/yarn-links) [![Coverage Status](https://img.shields.io/coveralls/dword-design/yarn-links/master.svg)](https://coveralls.io/r/dword-design/yarn-links?branch=master) [![dependency status](https://img.shields.io/david/dword-design/yarn-links.svg)](https://david-dm.org/dword-design/yarn-links)
<!--/@-->

<!--@pkg.description-->
This package outputs all linked yarn packages via the CLI or via an exported function.
<!--/@-->

<!--@installation()-->
## Installation

```sh
# via NPM
npm install --global yarn-links

# via Yarn
yarn global add yarn-links
```
<!--/@-->

## CLI Usage

```bash
$ yarn-links
  - http-server
  - npm-name-cli
```

## API Usage

```js
const yarnLinks = require('yarn-links')

const links = await yarnLinks()
// ['http-server', 'npm-name-cli']
```

<!--@license()-->
## License

MIT © Sebastian Landwehr
<!--/@-->
