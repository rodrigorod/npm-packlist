// cannot include package-lock.json in the root
const {resolve, basename} = require('path')
const pkg = resolve(__dirname, basename(__filename, '.js'))
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')
const t = require('tap')
rimraf.sync(pkg)
mkdirp.sync(pkg)
t.teardown(() => rimraf.sync(pkg))

const fs = require('fs')
fs.writeFileSync(pkg + '/package.json', JSON.stringify({
  files: ['.npmignore', 'package-lock.json']
}))
fs.writeFileSync(pkg + '/.npmignore', `
!package-lock.json
`)
fs.writeFileSync(pkg + '/package-lock.json', '{}')

const packlist = require('../')
t.test('try to include package-lock.json but cannot', async t => {
  t.matchSnapshot(packlist.sync({path: pkg}))
  await t.resolveMatchSnapshot(packlist({path: pkg}))
})


