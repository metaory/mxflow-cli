import 'zx/globals'
import boxen from 'boxen'
import ora from 'ora'
import pupa from 'pupa'

import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { catchOldConfig } from './catch.js'
import { xdgConfig } from 'xdg-basedir'
import checkoutBranch from './operations/checkoutBranch.js'

const spinner = ora()

global.C = chalk
// global.CONFIG_DIR = `${os.homedir()}/.config/hgit`
global.CONFIG_DIR = `${xdgConfig}/hgit`
global.CONFIG_PATH = `${CONFIG_DIR}/config.json`
global.CWD = process.cwd().replace(os.homedir(), '~')

global.PKG_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../package.json')

const { name, version } = await fs.readJson(PKG_PATH)
global.PKG_NAME = name
global.PKG_VERSION = version

global.info = (msg) => $.verbose && console.info(msg)

const _color = (color = 6) => {
  switch (color) {
    case 1: return 'red'
    case 2: return 'green'
    case 3: return 'yellow'
    case 4: return 'blue'
    case 5: return 'magenta'
    case 6: return 'cyan'
    default: return 'cyan'
  }
}
const _log = (txt, color, mode = 'reset') => console.log(chalk[mode][color](txt))
const _box = (txt, color, opt = {}) => _log(boxen(txt, opt), color)
global.log = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'grey']
  .reduce((acc, cur) => {
    acc[cur] = (txt) => _log(txt, cur)
    acc[cur + 'Dim'] = (txt) => _log(txt, cur, 'dim')
    acc[cur + 'Box'] = (txt, {
      title, padding = 1, borderStyle = cur === 'red' ? 'double' : 'bold'
    } = {}) =>
      _box(txt, cur, {
        title,
        padding,
        borderStyle
      })
    return acc
  }, {
    positive: (txt, etc = '') => _log(`✔ ${chalk.blue(txt)} ${etc}`, 'green'),
    info: (txt, etc = '') => _log(`ℹ ${chalk.magenta(txt)} ${etc}`, 'cyan'),
    warn: (txt, etc = '') => _log(`⚠  ${chalk.yellowBright(txt)} ${etc}`, 'yellow'),
    danger: (txt, etc = '') => _log(`✖ ${chalk.redBright(txt)} ${etc}`, 'red'),
    fatal: (txt, etc = '', color, title = CWD) => {
      const tc = _color(color)
      log.redBox(`${chalk[tc]('✖')} ${txt} ${chalk[tc](etc)}`, { title })
      process.exit(1)
    }
  })

global.runCommands = async (commands = [], data = {}) => {
  for (const cmdName of commands) {
    const [, pickOff] = cmdName.split('prompt_checkout_')
    if (pickOff) {
      await checkoutBranch(pickOff)
      continue
    }

    const cmd = cfg.commands[cmdName]
    const parsedCmd = pupa(cmd, data)

    $.verbose
      ? log.info(cmdName)
      : spinner.start(chalk.yellow(cmdName))

    const { stdout, stderr } = await $([parsedCmd])
    await sleep(cfg.sleep_between_commands) // XXX for no reason!!

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
  .map(x => '╸').join('')

let _config
Object.defineProperty(global, 'cfg', {
  get: () => _config,
  set: (val) => {
    catchOldConfig(val)
    info(val)
    _config = val
  },
  configurable: true
})
