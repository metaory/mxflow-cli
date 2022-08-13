import figlet from 'figlet'
import boxen from 'boxen'

import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

const packageJsonPath = resolve(__dirname, '../package.json')
let { name, version } = await fs.readJson(packageJsonPath)

const getFonts = () => new Promise((resolve) => figlet
  .fonts((_, fonts) => resolve(fonts)))

export default async function() {
  console.log('??', {name,version})
  console.log(chalk.red(
    boxen(' Work in Progress!  ', { padding: 1, borderStyle: 'double' })
  ))

  const fonts = await getFonts()
  const font = fonts[Math.floor(Math.random() * fonts.length)]
  figlet.text('JGit', { font }, (_, text) => console.log(text))

  await new Promise((resolve) => setTimeout(resolve, 0))

  console.log(chalk.grey(`font: ${font}`), '\n')
  console.log(chalk.blue(name), '@', chalk.yellow(version))
}
