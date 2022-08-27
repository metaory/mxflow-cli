import figures from 'figures'
import {
  stringInput,
  autocompleteInput
} from '../prompts.js'

const promptBranch = async(branchTypes) => {
  const { branchType } = await autocompleteInput('branchType', branchTypes)
  const { taskId } = await stringInput('taskId')
  const { description } = await stringInput('description')

  return {
    branchType,
    branchName: `${branchType}/${taskId}-${description}`
  }
}

// ---

export default async() => {
  const { branchType, branchName } = await promptBranch(cfg.branch_types)

  await runCommands(cfg.start_workflow[branchType + '__pre'])

  log.cyan('checking out new branch:')
  log.yellowBox(branchName)

  await $`git checkout -b ${branchName}`
    .pipe(process.stdout)

  await runCommands(cfg.start_workflow[branchType + '__post'] || [])
}
