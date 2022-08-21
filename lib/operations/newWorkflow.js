import {
  stringInput,
  listInput
} from '../prompts.js'

export default async() => {
  for (const cmdName of cfg.new_workflow_pre_commands) {
    const cmd = cfg.commands[cmdName]
    await spinner(chalk.cyan(cmdName), () => $([cmd]))
  }

  const { branchType } = await listInput('branchType', cfg.branch_types)
  const { taskId } = await stringInput('taskId')
  const { description } = await stringInput('description')
  const branchName = `${branchType}/${taskId}-${description}`

  log.cyan('checking out new branch:')
  log.yellowBox(branchName)

  await $`git checkout -b ${branchName}`
    .pipe(process.stdout)
}
