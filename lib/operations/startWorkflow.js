import pupa from 'pupa'
import { checkBranchExists, listLatestLogs } from '../git.js'
import { promptBranchName, promptBranchType } from '../prompts.js'

export default async({ collectType = false }) => {
  const branchType = collectType
    ? await promptBranchType([...cfg.branch_types])
    : cfg.trunk_branch_name

  const patternKey = `${branchType}__branch_pattern`
  const pattern = cfg.start_workflow[patternKey]
  if (!pattern) {
    log.fatal('config missing', patternKey)
  }

  const branchName = await promptBranchName(branchType, pattern)

  const branchExists = await checkBranchExists(branchName)
  if (branchExists) {
    log.fatal('Branch Name Exists!', branchName)
  }

  log.yellowBox(branchName, { title: 'branchName' })

  await runCommands(cfg.start_workflow[branchType + '__pre'])

  log.info('checking out new branch')

  await runCommands([`$ git checkout -b ${branchName}`])

  await runCommands(cfg.start_workflow[branchType + '__post'])

  await listLatestLogs()

  log.greenBox(pupa(cfg.bug_tracker_path, { branchName }), { title: 'bug tracker' })
}
