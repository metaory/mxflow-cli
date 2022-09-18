import { listRemoteBranches } from '../git.js'
import { autocompleteInput } from '../prompts.js'

// -------------------

export default async(off = '') => {
  head(import.meta, off)

  const branches = await getBranches(off)

  const { branchName } = await getBranchName(branches)

  await runCommands(cfg.checkout, { branchName })

  return branchName
}

// -------------------
const getBranchName = (branches) => autocompleteInput(
  'branchName',
  getBranchFormat(branches),
  'select base branch'
)

export const getBranchFormat = (branches, query = '') => branches.map(name => {
  const message = name
    .replace('origin/', C.dim('origin/'))
    .replace(query, C.yellow.dim(query))
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
