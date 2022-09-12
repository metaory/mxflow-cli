import 'zx/globals'
import boxen from 'boxen'
import ora from 'ora'

import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { catchOldConfig } from './catch.js'
import { xdgConfig } from 'xdg-basedir'
import checkoutBranch from './operations/checkoutBranch.js'

const spinner = ora()

// global.CONFIG_DIR = `${os.homedir()}/.config/hgit`
global.CONFIG_DIR = `${xdgConfig}/hgit`
global.CONFIG_PATH = `${CONFIG_DIR}/config.json`

global.PKG_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../package.json')

const { name, version } = await fs.readJson(PKG_PATH)
global.PKG_NAME = name
global.PKG_VERSION = version

global.info = (msg) => $.verbose && console.info(msg)

const _log = (txt, color, mode = 'reset') => console.log(chalk[mode][color](txt))
const _box = (txt, color, opt = {}) => _log(boxen(txt, opt), color)
global.log = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'grey']
  .reduce((acc, cur) => {
    acc[cur] = (txt) => _log(txt, cur)
    acc[cur + 'Dim'] = (txt) => _log(txt, cur, 'dim')
    acc[cur + 'Box'] = (txt, { title, padding = 1 } = {}) =>
      _box(txt, cur, {
        title,
        padding,
        borderStyle: cur === 'red' ? 'double' : 'single'
      })
    return acc
  }, {
    positive: (txt, etc = '') => _log(`✔ ${chalk.blue(txt)} ${etc}`, 'green'),
    info: (txt, etc = '') => _log(`ℹ ${chalk.magenta(txt)} ${etc}`, 'cyan'),
    warn: (txt, etc = '') => _log(`⚠  ${chalk.yellowBright(txt)} ${etc}`, 'yellow'),
    danger: (txt, etc = '') => _log(`✖ ${chalk.redBright(txt)} ${etc}`, 'red'),
    fatal: (txt, etc = '') => {
      _box(`✖ ${chalk.redBright(etc)} `, 'red', { title: txt, padding: 1 })
      process.exit(1)
    }
  })

global.runCommands = async(commands = []) => {
  for (const cmdName of commands) {
    const [, raw] = cmdName.split('$ ')
    const cmd = raw ?? cfg.commands[cmdName]

    log.info(cmdName + ':', cmd)
    await sleep(500) // XXX for no reason!

    const [, pickOff] = cmdName.split('git_pick_')
    if (pickOff) {
      await checkoutBranch(pickOff)
      continue
    }

    $.verbose ? log.info(cmdName) : spinner.start(cmdName)

    const { stdout, stderr } = await $([cmd])

    spinner[stderr && !stdout ? 'fail' : 'succeed'](cmdName)

    stdout && log.greenDim(stdout)
    stderr && log.redDim(stderr)
  }
}

global.fillFrom = (char = 'x') => Array
  .from({ length: process.stdout.columns })
  .map(x => char)
  .join('')

global.fillLine = (str = { length: process.stdout.columns }) => Array
  .from(str)
  .map(x => '=').join('')

let _config
Object.defineProperty(global, 'cfg', {
  get: () => _config,
  set: (val) => {
    catchOldConfig(val)
    info({ config: val })
    _config = val
  },
  configurable: true
})

global.spinner = spinner
