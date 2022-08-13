import 'zx/globals'
import { spinner } from 'zx/experimental'

export default async () => {
  console.log('Running Conflict Detection in')
  console.log('::', chalk.bold(process.cwd()), '\n')

  // await spinner('working...', () => $`sleep 5`)

  // let name = 'foobar'
  // await $`mkdir ${name}`
  // const { stdout } = await $`git branch --show-current`
  const { stdout } = await $`git symbolic-ref --short HEAD`
  const branch = stdout.replace(/[\r\n]/gm, '')
  console.log('current branch:', chalk.blue.bold(branch), '\n')

  // echo`Current branch is ${branch}.`
  

  // console.log('@###', isGitDirectory)
  // cd('/tmp')

  // $`git rev-parse --is-inside-work-tree`

  $`pwd`

  // $`git rev-parse --is-inside-work-tree`

}
