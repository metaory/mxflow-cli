import boxen from 'boxen'
import { spinner } from 'zx/experimental'
import { basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const _log = (txt, color) => console.log(chalk[color](txt))
const _box = (txt, color, opt = {}) => _log(boxen(txt, opt), color)

global.info = (msg) => $.verbose && console.info(msg)

global.log = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'grey']
  .reduce((acc, cur) => {
    acc[cur] = (txt) => _log(txt, cur)
    acc[cur + 'Box'] = (txt, { meta, padding = 1 } = {}) =>
      _box(txt, cur, {
        title: meta && basename(fileURLToPath(meta.url)).split('.').shift(),
        padding,
        borderStyle: cur === 'red' ? 'double' : 'single'
      })
    return acc
  }, {})

global.fillLine = (str = { length: process.stdout.columns }) => Array
  .from(str)
  .map(x => '=').join('') + '\n\n'

let _config
Object.defineProperty(global, 'cfg', {
  get: () => _config,
  set: function(val) {
    info({ config: val })
    _config = val
  },
  configurable: true
})

global.spinner = spinner
