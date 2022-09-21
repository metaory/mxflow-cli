import 'zx/globals'
import boxen from 'boxen'
import ora from 'ora'
import pupa from 'pupa'
import yaml from 'js-yaml'
import * as L from 'prettycli'
import { highlight } from 'cli-highlight'

import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { catchOldConfig } from './catch.js'
import { xdgConfig } from 'xdg-basedir'
import checkoutBranch from './operations/checkout.js'
import { confirmInput } from './steps/prompts.js'
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
global.CONFIG_PATH = `${CONFIG_DIR}/config.yml`
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
  for (const cmd of commands) {
    const [, pickOff] = cmd.split('autocomplete checkout ')
    if (pickOff) {
      await checkoutBranch(pickOff)
      continue
    }

    if (cmd === 'list logs') {
      await listLatestLogs()
      continue
    }

    const [_type, ..._action] = cmd.split(' ')
    const _cmd = _action.join(' ')
    const [_program] = _action
    if (_type === 'confirm') {
      L.warn(`${C.yellow.dim('confirm')} ${_cmd}`)
      const confirm = await confirmInput(_program)
      if (confirm[_program] === true) {
        await runCommands([_cmd], data)
      }
      continue
    }

    const parsedCmd = pupa(cmd, data)
    history.push(parsedCmd)

    $.verbose
      ? info(cmd)
      : spinner.start(C.yellow(cmd) + C.grey(` $ ${parsedCmd}`))

    try {
      if (!parsedCmd) throw new Error(`missing ${cmd}`)

      const { stdout, stderr } = await $([parsedCmd])
      await sleep(cfg.sleep_between_commands) // XXX for no reason!!

      spinner.succeed(cmd)

      stdout && log.greenDim(stdout)
      stderr && log.redDim(stderr)
    } catch ({ stdout, stderr, ...err }) {
      info(err)
      spinner.fail(cmd)

      stdout && log.greenDim(stdout)
      stderr && log.redDim(stderr)
    } finally {
      log.grey(fillFrom('╸'))
    }
  }
}
process.on('exit', (code) => {
  log.greyDim('\n' + fillFrom('━'))
  L.loading('history', `(${history.length})\n` +
    JSON.stringify(history, null, 2)
      .replaceAll('"', '')
      .replaceAll(',', '')
  )
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

global.logYaml = (str, ignoreIllegals = true) => {
  const theme = { string: C.blue, attr: C.cyan.bold }
  const language = 'yaml'
  console.log('\n' + highlight(str, { theme, language, ignoreIllegals }))
}

let _config
Object.defineProperty(global, 'cfg', {
  get: () => _config,
  set: (val) => {
    catchOldConfig(val)
    $.verbose && logYaml(yaml.dump(val))
    _config = val
  },
  configurable: true
})
