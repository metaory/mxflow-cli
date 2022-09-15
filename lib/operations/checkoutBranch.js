import { listRemoteBranches } from '../git.js'
import { autocompleteInput } from '../prompts.js'

export default async(off = '') => {
  log.info('checkout off', off)

  const branches = (await listRemoteBranches()).filter(x => x.includes(off))
  if (!branches.length) {
    log.fatal('no remote branch for', 'origin/' + cfg.trunk_branch_name)
  }
  const { branchName } = await autocompleteInput('branchName', branches, 'select base branch')

  await runCommands(cfg.checkout, { branchName })

  return branchName
}
