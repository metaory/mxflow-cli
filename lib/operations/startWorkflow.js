import { promptBranchName, promptBranchType } from '../prompts.js'

export default async({ collectType = false }) => {
  const branchType = collectType
    ? await promptBranchType(cfg.branch_types)
    : cfg.trunk_branch_name

  const patternKey = `${branchType}__branch_pattern`
  const pattern = cfg.start_workflow[patternKey] ||
    log.danger('config missing', patternKey) // TODO exit / mv

  const branchName = await promptBranchName(branchType, pattern)

  log.yellowBox(branchName, { title: 'branchName' })

  await runCommands(cfg.start_workflow[branchType + '__pre'] || [])

  log.info('checking out new branch')

  await runCommands([`$ git checkout -b ${branchName}`])

  await runCommands(cfg.start_workflow[branchType + '__post'] || [])
}
