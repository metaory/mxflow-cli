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

const promptBranch = async(branchTypes) => {
  const { branchType } = await autocompleteInput('branchType', branchTypes)
  const { taskId } = await stringInput('taskId')
  const { description } = await stringInput('description')
  const normalizedDescription = description.trim().replaceAll(' ', '_')

  return {
    branchType,
    branchName: `${branchType}/${taskId}-${normalizedDescription}`
  }
}

// ---

export default async() => {
  const { branchType, branchName } = await promptBranch(cfg.branch_types)

  await runCommands(cfg.start_workflow[branchType])

  log.cyan('checking out new branch:')
  log.yellowBox(branchName)

  await $`git checkout -b ${branchName}`
    .pipe(process.stdout)
}
