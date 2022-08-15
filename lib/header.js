import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const packageJsonPath = resolve(__dirname, '../package.json')
const { name, version } = await fs.readJson(packageJsonPath)

export default async function () {
  log.warnBox(' Work in Progress!  ')

  console.log(chalk.blue(name), '@', chalk.yellow(version), '\n')
}

/// //////////////////////////////////////////////////////////////
// await new Promise((resolve) => setTimeout(resolve, 3_000))
// await $`sleep 5`
/// //////////////////////////////////////////////////////////////
// import figlet from 'figlet'
// const getFonts = () => new Promise((resolve) => figlet
//   .fonts((_, fonts) => resolve(fonts)))
// const fonts = await getFonts()
// const font = fonts[Math.floor(Math.random() * fonts.length)]
// figlet.text('JGit', { font }, (_, text) => console.log(text))
// console.log(chalk.grey(`font: ${font}`), '\n')
