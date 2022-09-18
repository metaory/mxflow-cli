import { listRemoteBranches } from '../git.js'
import { autocompleteInput } from '../prompts.js'

// -------------------

export default async(query = '') => {
  head(import.meta, query)

  const branches = await getBranches(query)

  const { branchName } = await getBranchName(branches, query)

  await runCommands(cfg.checkout, { branchName })

  return branchName
}

// -------------------
const getBranchName = (branches, query) => autocompleteInput(
  'branchName',
  getBranchFormat(branches, query),
  'select base branch'
)

export const getBranchFormat = (branches, query = '') => branches.map(name => {
  const message = name
    .replace('origin/', C.dim('origin/'))
    .replace(query, C.yellow.dim(query))
  return { name, message }
})

const getBranches = async(query) => {
  const remoteBranches = await listRemoteBranches()
  const branches = remoteBranches.filter(x => x.includes(query))
  if (!branches.length) {
    log.grey(`create and push ${C.yellow.bold(query)} first.`)
    log.fatal('no remote branch for', 'origin/' + query)
  }
  return branches
}
