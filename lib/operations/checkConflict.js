import { getCurrentBranch, checkConflict, listRemoteBranches } from '../git.js'
import { stringInput, autocompleteInput } from '../prompts.js'
import { spawn } from 'node:child_process'
const memoize = {}

export default async function conflictDetection(fetch = true, _trunkBranchName) {
  log.cyanDim('Running Conflict Detection in:')
  log.yellowDim(process.cwd())
  log.grey(fillLine(process.cwd()))

  fetch && await runCommands(['git_fetch_origin'])

  const { trunk_branch_name: trunkBranchName } = await stringInput('trunk_branch_name', {
    message: 'enter search pattern',
    value: _trunkBranchName || cfg.trunk_branch_name
  })

  const currentBranch = await getCurrentBranch()

  const branches = await listRemoteBranches()

  const trunks = branches
    .filter(x => x.includes(trunkBranchName))
    .filter(x => x !== currentBranch)
  info({ trunks })

  if (!memoize[trunkBranchName]) {
    memoize[trunkBranchName] = []
    for (const trunk of trunks) {
      const status = await checkConflict(currentBranch, trunk)
      memoize[trunkBranchName].push(status)
    }
  }

  const conflictingBranches = memoize[trunkBranchName]
    .filter((x) => x.conflict === true)
    .map((x) => x.targetBranch)

  log.yellowBox(`${conflictingBranches.length} Conflicting Branch Found!`)

  const { branch } = await autocompleteInput('branch', [...conflictingBranches, '[Scan Again]'])

  if (branch === '[Scan Again]') { return conflictDetection() }

  await $`git merge --no-commit --no-ff ${branch} || true`

  spawn('git', ['diff', '--diff-filter=U', '--relative'],
    { stdio: [process.stdin, process.stdout, process.stderr] })
    .on('close', () => {
      $`git merge --abort`
      conflictDetection(false, trunkBranchName)
    })
}
