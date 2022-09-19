import figlet from 'figlet'
import gradient from 'gradient-string'
import { getCurrentBranch } from './git.js'

const getFonts = () => new Promise((resolve) => {
  figlet.fonts((_, fonts) => resolve(fonts))
})
const fonts = await getFonts()
const fontIndex = Math.floor(Math.random() * fonts.length)
const font = fonts[fontIndex] // 'Isometric3' 'Elite'

const asci = () => new Promise((resolve) => {
  figlet.text('HGit', { font }, (_, text) => resolve(text))
})

const text = await asci()
console.log(gradient.passion(text)) // mind, retro

log.greyDim(`font: ${font} (${fontIndex}/${fonts.length})`)

log.grey(PKG_NAME + ': ' + C.yellow(PKG_VERSION))

log.grey(fillFrom('╸')) // █ ▓ ▒ ░

L.loading('current branch', await getCurrentBranch())
