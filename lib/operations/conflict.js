import { spinner } from 'zx/experimental'
import { checkConflict, checkDirty } from '../git.js'

export default async () => {
  log.cyan('Running Conflict Detection in:')
  log.yellow(process.cwd())
  log.grey(Array.from(process.cwd()).map(x => '░').join('') + '\n\n')

  await spinner(chalk.cyan('fetching origin...'), () => $`git fetch origin`)

  // await cd('..')
  console.log('++++')
  await $`pwd`
  console.log('^^^^')
  return

  const { stdout } = await $`git branch --show-current`
  const currentBranch = stdout.replace(/[\r\n]/gm, '')
  console.log('current branch:', chalk.blue.bold(currentBranch), '\n')
  $`pwd`
  for (const branch of ['master', 'feature/CU-1234', 'feature/CU-2222']) {
    console.log('@@', { currentBranch, branch })
    await checkConflict(currentBranch, branch)
  }
}
