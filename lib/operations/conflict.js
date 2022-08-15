import { spinner } from 'zx/experimental'
import { getCurrentBranch, checkConflict } from '../git.js'

export default async () => {
  log.cyan('Running Conflict Detection in:')
  log.yellow(process.cwd())
  log.grey(Array.from(process.cwd()).map(x => '░').join('') + '\n\n')

  await spinner(chalk.cyan('fetching origin...'), () => $`git fetch origin`)

  const currentBranch = await getCurrentBranch()
  console.log('current branch:', chalk.blue.bold(currentBranch), '\n')
  $`pwd`
  for (const branch of ['master', 'feature/CU-1234', 'feature/CU-2222']) {
    await checkConflict(currentBranch, branch)
  }
}
