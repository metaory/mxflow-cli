import figlet from 'figlet'
import gradient from 'gradient-string'

const getFonts = () => new Promise((resolve) => {
  figlet.fonts((_, fonts) => resolve(fonts))
})
const fonts = await getFonts()
const font = fonts[Math.floor(Math.random() * fonts.length)]
// const font = 'Isometric3'

const asci = () => new Promise((resolve) => {
  figlet.text('HGit', { font }, (_, text) => resolve(text))
})

const text = await asci()
console.log(gradient.passion(text)) // mind, retro

log.greyDim(`font: ${font}`)

log.grey(PKG_NAME.toUpperCase() + ' ' + chalk.yellow(`v${PKG_VERSION}`))

log.grey(fillFrom('░')) // █ ▓ ▒ ░
