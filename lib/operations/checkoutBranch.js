import { listRemoteBranches } from '../git.js'
import { autocompleteInput } from '../prompts.js'

export default async(filter) => {
  await runCommands(cfg.checkout__pre)

  console.log('@', filter)
  const branches = (await listRemoteBranches()).filter(filter)
  const { branch } = await autocompleteInput('branch',
    branches,
    'select a remote branch to checkout')

  // await $`git reset --hard ${branch}`
  const { stdout, stderr } = await $`git checkout ${branch}`
  stdout && log.greenBox(stdout)
  log.redBox(stderr)

  await runCommands(cfg.checkout__post)

  return branch
}
