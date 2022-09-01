import { promptBranch } from '../prompts.js'

export default async() => {
  const { branchType, branchName } = await promptBranch(cfg.branch_types)

  await runCommands(cfg.start_workflow[branchType + '__pre'] || [])

  log.info('checking out new branch')
  log.yellowBox(branchName, { title: 'branchName' })

  await runCommands([`$ git checkout -b ${branchName}`])

  await runCommands(cfg.start_workflow[branchType + '__post'] || [])
}
