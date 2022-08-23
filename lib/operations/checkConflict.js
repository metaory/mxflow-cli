import { getCurrentBranch, checkConflict, listRemoteBranches } from '../git.js'
import { listInput, autocompleteInput } from '../prompts.js'
import { spawn } from 'child_process'

export default async function conflictDetection() {
  log.cyan('Running Conflict Detection in:')
  log.yellow(process.cwd())
  log.grey(fillLine(process.cwd()))

  await spinner(chalk.cyan('git_fetch_origin'), () => $([cfg.commands.git_fetch_origin]))

  const currentBranch = await getCurrentBranch()
  console.info('current branch:', chalk.blue.bold(currentBranch), '\n')

  const branches = await listRemoteBranches()

  const trunks = branches
    .filter(x => x.includes(cfg.trunk_branch_name))
    .filter(x => x !== currentBranch)
  info({ trunks })

  const conflictStatus = await Promise.all(trunks.map(branch => checkConflict(currentBranch, branch)))
  info({ conflictStatus })

  const conflictingBranches = conflictStatus.reduce((acc, cur) => {
    if (cur.conflict === true) {
      acc.push(cur.targetBranch)
    }
    return acc
  }, [])

  log.yellowBox(`${conflictingBranches.length} Conflicting Branch Found!`)

  const { branch } = await autocompleteInput('branch',
    [...conflictingBranches, '[Scan Again]'],
    'select a remote branch to compare against')

  if (branch === '[Scan Again]') { return conflictDetection() }

  await $`git merge --no-commit --no-ff ${branch} || true`

  spawn('git', ['diff', '--diff-filter=U', '--relative'],
    { stdio: [process.stdin, process.stdout, process.stderr] })
    .on('close', () => $`git merge --abort`)
  // .on('close', conflictDetection)
}
// const { stdout } = await $`git diff ${currentBranch}...${branch}`
// process.stdout.write(stdout)
// spawn("npm i", [], {stdio: "inherit"});

// const cmd = spawn('npm', ['i'], { stdio: [process.stdin, process.stdout] })
// cmd.stderr.on('data', (data) => {
//   console.error(`stderr: ${data}`)
// })

// const childProcess = require('child_process')
// const child = spawn('npm', ['install'], { stdio: ['inherit', 'pipe', 'pipe'] })
// child.stdout.on('data', d => {
//   process.stdout.write(d.toString())
// })
// const child2 = spawn('htop', {
//   stdio: 'inherit',
//   shell: true,
//   cwd: os.homedir()
// })

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
// await $`git fetch origin`.pipe(process.stdout)
// await $`git diff ${currentBranch}...${branch}`
//   .pipe(process.stdout)
