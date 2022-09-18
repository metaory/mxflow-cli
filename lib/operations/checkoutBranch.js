import { listRemoteBranches } from '../git.js'
import { autocompleteInput } from '../prompts.js'

// -------------------

export default async(off = '') => {
  head(import.meta)
  log.info('checkout off', off)

  const branches = await getBranches(off)

  const branchesFormat = getBranchFormat(branches)

  const { branchName } = await autocompleteInput(
    'branchName',
    branchesFormat,
    'select base branch'
  )

  await runCommands(cfg.checkout, { branchName })

  return branchName
}

// -------------------

export const getBranchFormat = (branches, query = '') => branches.map(name => {
  const branchName = name
    .replace(query, C.yellow.dim(query))
    .replace('origin/', '')
  const message = C.dim('origin/') + branchName
  return { name, message }
})

const getBranches = async(off) => {
  const remoteBranches = await listRemoteBranches()
  const branches = remoteBranches.filter(x => x.includes(off))
  if (!branches.length) {
    log.grey(`create and push ${C.bold(off)} first.`)
    log.fatal('no remote branch for', 'origin/' + off)
  }
  return branches
}
