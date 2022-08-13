import figlet from 'figlet'

const getFonts = () => new Promise((resolve) => figlet
  .fonts((_, fonts) => resolve(fonts)))

export default async function () {

  const fonts = await getFonts()
  figlet.text('XJGit', { font:
    fonts[Math.floor(Math.random() * fonts.length)]
  }, (_, text) => console.log(text))
  await new Promise((resolve) => setTimeout(resolve, 1_000))
}
