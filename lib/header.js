import figlet from 'figlet'
import gradient from 'gradient-string'
import { getCurrentBranch } from './git.js'
import { resetConfig } from './config.js'

const getFonts = () => new Promise((resolve) => {
  figlet.fonts((_, fonts) => resolve(fonts))
})
const fonts = await getFonts()
const fontIndex = Math.floor(Math.random() * fonts.length)
const font = fonts[fontIndex] // 'Isometric3' 'Elite'

const asci = () => new Promise((resolve) => {
  figlet.text('MXf', { font }, (_, text) => resolve(text))
})

const text = await asci()
console.log(gradient.passion(text)) // mind, retro

log.greyDim(`font: ${font} (${fontIndex}/${fonts.length})`)

log.grey(PKG_NAME + ': ' + C.yellow(PKG_VERSION))

log.grey(fillFrom('╸')) // █ ▓ ▒ ░

const currentBranch = await getCurrentBranch()
currentBranch && L.loading('branch', currentBranch)

if (argv.help || argv._.includes('help')) {
  L.loading('options', `
init                    | init sample configuration
trigger <workflow-name> | non-interactive workflow trigger
version, --version      | show version
help, --help            | help menu
-v, --verbose           | verbose logs
-F, --force             | force bypass confirmation prompts
--no-catch-git          | bypass initial git checks
--setup-completion      | setup shell tab completion
--clean-completion      | cleanup tab completion`)
  process.exit()
}

if (argv.reset || argv._.includes('reset')) {
  await resetConfig()
}
