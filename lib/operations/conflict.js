import { spinner } from 'zx/experimental'
import { checkConflict, checkDirty } from '../git.js'

export default async () => {
  log.info('Running Conflict Detection in:')
  log.warn(process.cwd() + '\n')

  const isDirty = await checkDirty()
  console.log('@:', isDirty)
  if (isDirty === true) {
    log.warnBox('directory is dirty')
    await $`git status --short`
    log.info('stash your changes before continuing.')
    log.success('$ git stash push')
    return process.exit(-1)
  } else {
    log.success('directory is clean. \n')
  }

  await spinner('fetching origin...', () => $`git fetch origin`)

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
