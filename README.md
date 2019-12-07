<!-- TITLE/ -->

<h1>yarn-links</h1>

<!-- /TITLE -->


<!-- BADGES/ -->

<span class="badge-npmversion"><a href="https://npmjs.org/package/yarn-links" title="View this project on NPM"><img src="https://img.shields.io/npm/v/yarn-links.svg" alt="NPM version" /></a></span>
<span class="badge-travisci"><a href="http://travis-ci.org/dword-design/yarn-links" title="Check this project's build status on TravisCI"><img src="https://img.shields.io/travis/dword-design/yarn-links/master.svg" alt="Travis CI Build Status" /></a></span>
<span class="badge-coveralls"><a href="https://coveralls.io/r/dword-design/yarn-links" title="View this project's coverage on Coveralls"><img src="https://img.shields.io/coveralls/dword-design/yarn-links.svg" alt="Coveralls Coverage Status" /></a></span>
<span class="badge-daviddm"><a href="https://david-dm.org/dword-design/yarn-links" title="View the status of this project's dependencies on DavidDM"><img src="https://img.shields.io/david/dword-design/yarn-links.svg" alt="Dependency Status" /></a></span>
<span class="badge-shields"><a href="https://img.shields.io/badge/renovate-enabled-brightgreen.svg"><img src="https://img.shields.io/badge/renovate-enabled-brightgreen.svg" /></a></span>

<!-- /BADGES -->


<!-- DESCRIPTION/ -->

This package outputs all linked yarn packages via the CLI or via an exported function.

<!-- /DESCRIPTION -->


<!-- INSTALL/ -->

<h2>Install</h2>

<a href="https://npmjs.com" title="npm is a package manager for javascript"><h3>npm</h3></a>
<h4>Install Globally</h4>
<ul>
<li>Install: <code>npm install --global yarn-links</code></li>
<li>Executable: <code>yarn-links</code></li>
</ul>
<h4>Install Locally</h4>
<ul>
<li>Install: <code>npm install --save yarn-links</code></li>
<li>Executable: <code>npx yarn-links</code></li>
<li>Require: <code>require('yarn-links')</code></li>
</ul>

<!-- /INSTALL -->


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

<!-- LICENSE/ -->

<h2>License</h2>

Unless stated otherwise all works are:

<ul><li>Copyright &copy; Sebastian Landwehr</li></ul>

and licensed under:

<ul><li><a href="http://spdx.org/licenses/MIT.html">MIT License</a></li></ul>

<!-- /LICENSE -->
