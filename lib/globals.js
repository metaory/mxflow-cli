import 'zx/globals'
import boxen from 'boxen'
import ora from 'ora'
import pupa from 'pupa'
import * as L from 'prettycli'

import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { catchOldConfig } from './catch.js'
import { xdgConfig } from 'xdg-basedir'
import checkoutBranch from './operations/checkoutBranch.js'
import { confirmInput } from './prompts.js'
import { listLatestLogs } from './git.js'

$.verbose = argv.verbose ?? false

const spinner = ora()
const history = []
const startTime = Date.now()

const replaceHome = (str = process.cwd()) => str.replace(os.homedir(), '~')
global.spinner = spinner
global.C = chalk
global.L = L
// global.CONFIG_DIR = `${os.homedir()}/.config/hgit`
global.CONFIG_DIR = `${xdgConfig}/hgit`
global.CONFIG_PATH = `${CONFIG_DIR}/config.json`
global.REL_CONFIG_PATH = replaceHome(CONFIG_PATH)
global.CWD = replaceHome()

global.PKG_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../package.json')

const getModuleName = (url) => {
  const [[moduleName]] = fileURLToPath(url)
    .split('/')
    .map(x => x.split('.'))
    .reverse()
  return moduleName
}

const { name, version } = await fs.readJson(PKG_PATH)
global.PKG_NAME = name
global.PKG_VERSION = version

global.head = ({ url }, etc = '-') =>
  L.info(getModuleName(url), 'module loaded ' + C.yellow(`⌜${etc}⌝`))
global.info = (msg) => $.verbose && console.info(msg)

const runCommands = global.runCommands = async(commands = [], data = {}) => {
  for (const cmdName of commands) {
    const [, pickOff] = cmdName.split('prompt_checkout__')
    if (pickOff) {
      await checkoutBranch(pickOff)
      continue
    }

    if (cmdName === 'list-latest-logs') {
      await listLatestLogs()
      continue
    }

    const [type, action] = cmdName.split('__')
    if (type === 'confirm') {
      L.warn(action)
      const confirm = await confirmInput(action)
      if (confirm[action] === true) {
        await runCommands([action], data)
      }
      continue
    }

    const cmd = cfg.commands[cmdName] ?? ''
    const parsedCmd = pupa(cmd, data)
    history.push(parsedCmd)

    $.verbose
      ? info(cmdName)
      : spinner.start(C.yellow(cmdName) + C.grey(` $ ${cmd}`))

    try {
      if (!parsedCmd) throw new Error(`missing ${cmdName}`)

      const { stdout, stderr } = await $([parsedCmd])
      await sleep(cfg.sleep_between_commands) // XXX for no reason!!

      spinner.succeed(cmdName)

      stdout && log.greenDim(stdout)
      stderr && log.redDim(stderr)
    } catch ({ stdout, stderr, ...err }) {
      info(err)
      spinner.fail(cmdName)

      stdout && log.greenDim(stdout)
      stderr && log.redDim(stderr)
    }
  }
}
process.on('exit', (code) => {
  L.loading(`command history (${history.length})`, '\n' +
    JSON.stringify(history, null, 3))
  const took = ((Date.now() - startTime) / 1000).toFixed(1)
  L.info('done', `took ${took}s`)
})


const _log = (txt, color, mode = 'reset') => console.log(C[mode][color](txt))
const _box = (txt, color, opt = {}) => _log(boxen(txt, opt), color)
global.log = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'grey']
  .reduce((acc, cur) => {
    acc[cur] = (txt) => _log(txt, cur)
    acc[cur + 'Sat'] = (txt) => _log(txt, cur + 'Bright')
    acc[cur + 'Dim'] = (txt) => _log(txt, cur, 'dim')
    acc[cur + 'Box'] = (txt, {
      title,
      padding = 1,
      borderStyle = cur === 'red' ? 'double' : 'bold'
    } = {}) => _box(txt, cur, { title, padding, borderStyle })

    return acc
  }, {
    pass: (txt, etc = '') => _log(`✔ ${C.blue(txt)} ${etc}`, 'green'),
    info: (txt, etc = '') => _log(`ℹ ${C.magenta(txt)} ${etc}`, 'cyan'),
    warn: (txt, etc = '') => _log(`⚠ ${C.yellowBright(txt)} ${etc}`, 'yellow'),
    fail: (txt, etc = '') => _log(`✖ ${C.redBright(txt)} ${etc}`, 'red'),
    fatal: (txt, etc = '', title = CWD) => {
      const icon = C.redBright('✖')
      log.redBox(`${icon} ${txt} ${C.redBright(etc)}`, { title })
      process.exit(1)
    }
  })

global.fillFrom = (char = 'x', length = process.stdout.columns) => Array
  .from({ length })
  .map(x => char)
  .join('')

global.fillTo = (str) => Array
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
