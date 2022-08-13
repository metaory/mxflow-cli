import figlet from 'figlet'
import boxen from 'boxen'

const getFonts = () => new Promise((resolve) => figlet
  .fonts((_, fonts) => resolve(fonts)))

export default async function() {
  console.log(chalk.red(
    boxen(' Work in Progress!  ', { padding: 1, borderStyle: 'double' })
  ))

  const fonts = await getFonts()
  const font = fonts[Math.floor(Math.random() * fonts.length)]
  figlet.text('XJGit', { font }, (_, text) => console.log(text))
  await new Promise((resolve) => setTimeout(resolve, 1_000))
  console.log(chalk.grey(`font: ${font}`))
  console.log(__dirname)
  console.log(chalk.grey(`version: ${font}`))
}
