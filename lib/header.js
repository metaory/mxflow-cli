// import figlet from 'figlet'
import boxen from 'boxen'

import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

const packageJsonPath = resolve(__dirname, '../package.json')
let { name, version } = await fs.readJson(packageJsonPath)


export default async function() {
  console.log(chalk.red(
    boxen(' Work in Progress!  ', { padding: 1, borderStyle: 'double' })
  ))

  // await new Promise((resolve) => setTimeout(resolve, 3_000))
  await $`sleep 5`

  // console.log(chalk.grey(`font: ${font}`), '\n')
  console.log(chalk.blue(name), '@', chalk.yellow(version), '\n')
}

  // const getFonts = () => new Promise((resolve) => figlet
  //   .fonts((_, fonts) => resolve(fonts)))
  // const fonts = await getFonts()
  // const font = fonts[Math.floor(Math.random() * fonts.length)]
  // figlet.text('JGit', { font }, (_, text) => console.log(text))

