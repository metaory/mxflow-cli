import { getCurrentBranch, checkConflict, listRemoteBranches } from '../git.js'
import { stringInput, autocompleteInput } from '../prompts.js'
import { getBranchFormat } from './checkoutBranch.js'

import { spawn } from 'node:child_process'
const memoize = {}

export default async function conflictDetection(fetch = true, _trunkBranchName) {
  head(import.meta, _trunkBranchName)
  log.cyanDim('Running Conflict Detection in:')
  log.yellowDim(CWD)
  log.grey(fillTo(CWD))

  fetch && await runCommands(['git_fetch_origin'])

  const { trunk_branch_name: trunkBranchName } = await getTrunkBranchName(_trunkBranchName)

  const branches = await listRemoteBranches()

  await cache(branches, trunkBranchName)

  const branch = await getBranch(trunkBranchName)

  if (branch === '[Scan Again]') { return conflictDetection() }

  await $`git merge --no-commit --no-ff ${branch} || true`

  spawn('git', ['diff', '--diff-filter=U', '--relative'],
    { stdio: [process.stdin, process.stdout, process.stderr] })
    .on('close', () => {
      $`git merge --abort`
      conflictDetection(false, trunkBranchName)
    })
}

// ------------

const getTrunkBranchName = (value = cfg.trunk_branch_name) =>
  stringInput('trunk_branch_name', {
    message: 'enter search pattern',
    value
  })

const cache = async(branches, trunkBranchName) => {
  const currentBranch = await getCurrentBranch()

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
}

const getBranch = (trunkBranchName) => {
  const conflictingBranches = memoize[trunkBranchName]
    .filter((x) => x.conflict === true)
    .map((x) => x.targetBranch)
  const conflictingBranchesFormat = getBranchFormat(conflictingBranches, trunkBranchName)

  log.yellowBox(`${conflictingBranches.length} Conflicting Branch Found!`)

  return autocompleteInput('branch', [
    ...conflictingBranchesFormat,
    '[Scan Again]'
  ])
}
