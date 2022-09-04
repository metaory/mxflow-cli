import { promptBranch } from '../prompts.js'
import checkoutBranch from './checkoutBranch.js'

export default async(tpl) => {
  const { branchType, branchName } = await promptBranch(cfg.branch_types, tpl)

  await runCommands(cfg.start_workflow[branchType + '__pre'] || [])

  let branchOff
  if (cfg.trunk_based && cfg.trunk_based.includes(branchType)) {
    branchOff = await checkoutBranch(x => x.includes(cfg.trunk_branch_name))
  }

  log.info(`checking out new branch off ${branchOff}`)
  log.yellowBox(branchName, { title: 'branchName' })

  await runCommands([`$ git checkout -b ${branchName} ${branchOff}`])

  await runCommands(cfg.start_workflow[branchType + '__post'] || [])
}
