import {
  stringInput,
  listInput
} from '../prompts.js'

export default async () => {
  const { branchType } = await listInput('branchType', ['feature', 'buglist', 'other'])
  const { taskId } = await stringInput('taskId')
  const { description } = await stringInput('description')
  const branchName = `${branchType}/${taskId}-${description}`

  await spinner(chalk.cyan('git fetch origin'), () => $`git fetch origin`)
  await spinner(chalk.cyan('git checkout master'), () => $`git checkout master`)
  await spinner(chalk.cyan('git merge origin/master'), () => $`git merge origin/master`)

  log.cyan('checking out new branch:')
  log.yellowBox(branchName)

  await $`git checkout -b ${branchName}`
    .pipe(process.stdout)
}
