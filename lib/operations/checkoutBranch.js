import { listRemoteBranches } from '../git.js'
import { autocompleteInput } from '../prompts.js'

export default async() => {
  await spinner(chalk.cyan('git_fetch_origin'), () => $([cfg.commands.git_fetch_origin]))

  const branches = await listRemoteBranches()
  const { branch } = await autocompleteInput('branch',
    branches,
    'select a remote branch to checkout')

  await $`git reset --hard ${branch}`
  const { stderr } = await $`git checkout ${branch}`
  log.greenBox(stderr)
}
