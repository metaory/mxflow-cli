import 'zx/globals'
import boxen from 'boxen'
import ora from 'ora'
import pupa from 'pupa'
import * as L from 'prettycli'
import { highlight } from 'cli-highlight'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as dotenv from 'dotenv'

import { catchConfigSchema, catchOldConfig } from './catch.js'
import checkoutBranch from './operations/checkout.js'
import { confirmInput } from './steps/prompts.js'
import { getCurrentBranch, listLatestLogs, logBugTrackerUrl } from './git.js'
import Config from './config.js'

dotenv.config()
$.verbose = argv.verbose ?? argv.v ?? false
// $.prefix = 'set -euo pipefail;'

const spinner = ora()
const history = []
const historyStatus = []
const startTime = Date.now()

const replaceHome = (str = process.cwd()) => str.replace(os.homedir(), '~')

global.spinner = spinner
global.C = chalk
global.L = L
global.PKG_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../package.json')
const { name, version } = await fs.readJson(PKG_PATH)
global.PKG_NAME = name
global.PKG_VERSION = version
global.CWD = replaceHome()

if (argv.version || argv._.includes('version')) {
  console.log(PKG_VERSION)
  process.exit()
}

const getModuleName = (url) => {
  const [[moduleName]] = fileURLToPath(url)
    .split('/')
    .map(x => x.split('.'))
    .reverse()
  return moduleName
}

global.head = ({ url }, etc = '-') =>
  L.info(getModuleName(url), 'module loaded ' +
    C.yellow(`\n⌜${replaceHome(String(etc))}⌝`)) // ⌞⌟ ⌜⌝

global.info = (msg, etc) => $.verbose && console.info(msg, etc)

const logTitle = () => {
  const { columns } = process.stdout
  const title = `${C.blue.dim('STEP')} ${C.blue(history.length)}\n`
  process.stdout.write(fillFrom(' ', columns / 3) + title)
}

const globalContext = { ...process.env }

const $$ = global.$$ = async(commands = [], data = {}) => {
  const currentBranch = await getCurrentBranch()

  const context = { ...globalContext, 'current-branch': currentBranch, ...data }
  for (const cmd of commands) {
    // Special commands
    if (typeof cmd === 'object') {
      const [key] = Object.keys(cmd)
      switch (key) {
        case 'log-bugtracker':
          await logBugTrackerUrl(data, cmd[key])
          break
        case 'checkout-branch':
          globalContext[cmd[key].export ?? 'branch'] = await checkoutBranch(cmd[key])
          break
        case 'list-logs':
          await listLatestLogs(cmd[key])
          break
      }
      historyStatus.push(C.yellow('ℹ'))
      history.push(key)
      continue
    }

    // Changes the current working directory
    if (cmd.startsWith('cd')) {
      const [, path] = cmd.split(' ')
      const resolved = pupa(path, context)
      cd(resolved)
      historyStatus.push(C.yellow('ℹ'))
      history.push(resolved)
      continue
    }

    // Confirmation step
    const [type, ...action] = cmd.split(' ')
    if (type === 'confirm') {
      const command = action.join(' ')
      const [program] = action
      L.warn(`${C.yellow.dim('confirm')} ${command}`)
      const confirm = await confirmInput(program)
      if (confirm[program] === true) {
        await $$([command], data)
      }
      continue
    }

    const parsedCmd = pupa(cmd, context)
    history.push(parsedCmd)

    logTitle()

    $.verbose
      ? info(cmd)
      : spinner.start(C.yellow(cmd) + C.grey(`\n$ ${parsedCmd}\n`))

    const logOutput = ({ stdout, stderr }) => {
      const formatOut = (str, color) => str
        .split('\n')
        .filter(x => x)
        .map(x => C[color].bold('┃ ') + x)
        .join('\n')
      stdout && log.greenDim(formatOut(stdout, 'green'))
      stderr && log.redDim(formatOut(stderr, 'red'))
    }

    try {
      if (!parsedCmd) throw new Error(`missing ${cmd}`)

      const output = await $([parsedCmd])
      await sleep(cfg?.sleep ?? 1000) // XXX for no reason!!

      // spinner.succeed(cmd)
      spinner.stop(cmd)
      log.green('┃ ' + '✔ ' + C.reset.bold(cmd))

      logOutput(output)
      historyStatus.push(C.green('✔'))
    } catch (err) {
      historyStatus.push(C.red('✖'))
      // spinner.fail(cmd)
      spinner.stop(cmd)
      log.red('┃ ' + '✖ ' + C.reset.bold(cmd))
      info(err)

      logOutput(err)

      if (err.exitCode !== 0 && cfg.exit_on_error) {
        L.error(err.stderr || err.stdout)
      }
    } finally {
      log.grey(fillFrom('╸'))
    }
  }
}
process.on('exit', (code) => {
  L.loading('history', history.length)
  history.forEach((_, i) => process.stdout.write(
    ' '.repeat(4) +
    historyStatus[i] +
    ' '.repeat(1) +
    C.blue(history[i]) + '\n')
  )
  process.stdout.write('\n')
  const took = ((Date.now() - startTime) / 1000).toFixed(1)
  L.info('done', `took ${took}s`)
})

const _log = (txt, color, mode = 'reset') => console.log(C[mode][color](txt))
const _box = (txt, color, opt = {}) => _log(boxen(txt, opt), color)
const _upp = (str) => str.charAt(0).toUpperCase() + str.substr(1, str.length)
global.log = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'grey']
  .reduce((acc, cur) => {
    acc[cur] = (txt) => _log(txt, cur)
    acc[cur + 'Sat'] = (txt) => _log(txt, cur + 'Bright')
    acc[cur + 'Dim'] = (txt) => _log(txt, cur, 'dim')
    acc['bg' + _upp(cur)] = (txt) => _log(C.black.bold(txt), 'bg' + _upp(cur))
    acc[cur + 'Box'] = (txt, {
      title,
      padding = 1,
      borderStyle = cur === 'red' ? 'double' : 'bold'
    } = {}) => _box(txt, cur, { title, padding, borderStyle })

    return acc
  }, {
    pass: (txt, etc = '') => _log(`✔ ${C.blue(replaceHome(txt))} ${etc}`, 'green'),
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
    val.sleep = Number(process.env.MXF_SLEEP ?? argv.sleep ?? val.sleep ?? 1000)
    $.verbose && L.warn('sleep' + C.yellow.dim(' is set to ') +
      `${C.bold((val.sleep / 1000).toFixed(1))}s`)
    catchConfigSchema(val)
    catchOldConfig(val)
    info(JSON.stringify(val, null, 2), C.yellow(val.version))
    _config = val
  },
  configurable: true
})

global.cfg = await new Config().init()
