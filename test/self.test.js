const api = require('../dist').default

// docker run -e "NODE_ENV=production" -u node -v "$PWD":/var/www -w /var/www node:alpine node test/index.js
test('self', () => expect(api()).resolves.toEqual([]))
