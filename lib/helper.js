import boxen from 'boxen'
import { spinner } from 'zx/experimental'

const _log = (txt, color) => console.log(chalk[color](txt))
const _box = (txt, color, opt = {}) => _log(boxen(txt, opt), color)

global.log = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'grey']
  .reduce((acc, cur) => {
    acc[cur] = (txt) => _log(txt, cur)
    acc[cur + 'Box'] = (txt) => _box(txt, cur, {
      padding: 1,
      borderStyle: cur === 'red' ? 'double' : 'single'
    })
    return acc
  }, {})

global.fillLine = (str = { length: process.stdout.columns }) => Array
  .from(str)
  .map(x => '=').join('') + '\n\n'

global.spinner = spinner
