import {
  stringInput,
  listInput
} from '../prompts.js'

export default async () => {
  const { branchType } = await listInput('branchType', ['feature', 'buglist', 'other'])
  const { taskId } = await stringInput('taskId')
  const { description } = await stringInput('description')
  const branchName = `${branchType}/${taskId}-${description}`

  log.cyan('checking out new branch:')
  log.yellowBox(branchName)

  await $`git checkout -b ${branchName}`
    .pipe(process.stdout)
}
