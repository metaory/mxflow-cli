import {
  stringInput,
  autocompleteInput
} from '../prompts.js'

const runCommands = async(commands) => {
  for (const cmdName of commands) {
    const cmd = cfg.commands[cmdName]
    await spinner(chalk.cyan(cmdName), () => $([cmd]))
  }
}

const promptBranchName = async(branchTypes) => {
  const { branchType } = await autocompleteInput('branchType', branchTypes)
  const { taskId } = await stringInput('taskId')
  const { description } = await stringInput('description')
  const normalizedDescription = description.trim().replaceAll(' ', '_')

  return `${branchType}/${taskId}-${normalizedDescription}`
}

// ---

export default async() => {
  await runCommands(cfg.new_workflow_pre_commands)

  const branchName = await promptBranchName(cfg.branch_types)

  log.cyan('checking out new branch:')
  log.yellowBox(branchName)

  await $`git checkout -b ${branchName}`
    .pipe(process.stdout)
}
