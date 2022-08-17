import { spinner } from 'zx/experimental'
import { getCurrentBranch, checkConflict, listRemoteBranches } from '../git.js'
import { listInput } from '../prompts.js'

export default async function conflictDetection () {
  log.cyan('Running Conflict Detection in:')
  log.yellow(process.cwd())
  log.grey(Array.from(process.cwd()).map(x => '░').join('') + '\n\n')

  await spinner(chalk.cyan('fetching origin...'), () => $`git fetch origin`)
  // await $`git fetch origin`.pipe(process.stdout)

  const currentBranch = await getCurrentBranch()
  console.log('current branch:', chalk.blue.bold(currentBranch), '\n')
  $`pwd`
  // for (const branch of ['master', 'feature/CU-1234', 'feature/CU-2222']) {
  //   await checkConflict(currentBranch, branch)
  // }

  // const foo = []
  // await ['master', 'feature/CU-1234', 'feature/CU-2222'].reduce((promise, branch) => {
  //   return promise
  //     .then((result) =>
  //       checkConflict(currentBranch, branch).then((result) => foo.push(result))
  //     )
  //     .catch(console.error)
  // }, Promise.resolve())

  const branches = await listRemoteBranches()
  console.log('@::', { branches })
  const trunks = branches.filter(x => x.includes(cfg.trunk_branch_name)).map(x => x.trim())
  console.log('@::', { trunks })

  const conflictStatus = await Promise.all([trunks].map(branch => checkConflict(currentBranch, branch)))

  const conflictingBranches = conflictStatus.reduce((acc, cur) => {
    if (cur.ok === false) {
      acc.push(cur.targetBranch)
    }
    return acc
  }, [])

  const { branch } = await listInput('branch', [...conflictingBranches, 'back'], 'show conflict against')
  // console.log({ branch }, '@@@')
  if (branch === 'back') {
    return conflictDetection()
  }

  // Changes that occurred on the master branch since when the topic branch was started off it.
  await $`git diff ${currentBranch}...${branch}`
    .pipe(process.stdout)
}
// const { stdout } = await $`git diff ${currentBranch}...${branch}`
// process.stdout.write(stdout)
