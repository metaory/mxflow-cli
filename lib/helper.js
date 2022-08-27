import boxen from 'boxen'
import { spinner } from 'zx/experimental'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const _log = (txt, color) => console.log(chalk[color](txt))
const _box = (txt, color, opt = {}) => _log(boxen(txt, opt), color)

global.CONFIG_DIR = `${os.homedir()}/.config/hgit`
global.CONFIG_PATH = `${CONFIG_DIR}/config.json`

global.PKG_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../package.json')

const { name, version } = await fs.readJson(PKG_PATH)
global.PKG_NAME = name
global.PKG_VERSION = version

global.info = (msg) => $.verbose && console.info(msg)

global.log = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'grey']
  .reduce((acc, cur) => {
    acc[cur] = (txt) => _log(txt, cur)
    acc[cur + 'Box'] = (txt, { title, padding = 1 } = {}) =>
      _box(txt, cur, {
        title,
        padding,
        borderStyle: cur === 'red' ? 'double' : 'single'
      })
    return acc
  }, {})

global.runCommands = async(commands) => {
  for (const cmdName of commands) {
    const cmd = cfg.commands[cmdName]
    await spinner(chalk.cyan(cmdName), () => $([cmd]).stdio('pipe'))
    console.log(chalk.green(figures.tick), chalk.bold(cmdName))
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
  set: async function(val) {
    const [, minorVersion] = PKG_VERSION.split('.')
    const [, valMinorVersion] = (val.config_version || '').split('.')
    const oldConfig = 'config_version' in val === false

    if ((oldConfig) || (valMinorVersion && minorVersion !== valMinorVersion)) {
      const backup = '/tmp/hgit.json'
      log.redBox('Older config detected.')
      log.red('removing the config...')
      log.yellow(`keeping a backup in: ${backup}`)
      await $`cp ${CONFIG_PATH} ${backup}`
      await $`rm -rf ${CONFIG_PATH}`
      log.grey('you may run the cli again')
      process.exit()
    }

    info({ config: val })
    _config = val
  },
  configurable: true
})

global.spinner = spinner
