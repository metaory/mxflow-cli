import figlet from 'figlet'
import gradient from 'gradient-string'

const getFonts = () => new Promise((resolve) => {
  figlet.fonts((_, fonts) => resolve(fonts))
})
const fonts = await getFonts()
const font = fonts[Math.floor(Math.random() * fonts.length)]
// const font = 'Isometric3'

const asci = () => new Promise((resolve) => {
  figlet.text('JGit', { font }, (_, text) => resolve(text))
})

const text = await asci()
// console.log(gradient('cyan', 'pink')(text))
console.log(gradient.mind(text))

console.log(chalk.grey(`font: ${font}`))

console.log(chalk.grey(PKG_NAME.toUpperCase()), chalk.yellow(PKG_VERSION))

log.grey(fillFrom('░')) // █ ▓ ▒ ░
