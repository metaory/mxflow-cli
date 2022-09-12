import { promptBranch } from '../prompts.js'

export default async(tpl) => {
  const {
    branchType = cfg.trunk_branch_name,
    branchName
  } = await promptBranch(cfg.branch_types, tpl)

  await runCommands(cfg.start_workflow[branchType + '__pre'] || [])

  log.info('checking out new branch')
  log.yellowBox(branchName, { title: 'branchName' })

  await runCommands([`$ git checkout -b ${branchName}`])

  await runCommands(cfg.start_workflow[branchType + '__post'] || [])
}
