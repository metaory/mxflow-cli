import { listRemoteBranches } from '../git.js'
import { autocompleteInput } from '../prompts.js'

export default async(off = '') => {
  log.info('checkout off', off)
  await runCommands(cfg.checkout__pre)

  const branches = (await listRemoteBranches()).filter(x => x.includes(off))
  if (!branches.length) {
    log.fatal(`No Remote Branch`, `No remote ${chalk.bold(cfg.trunk_branch_name)} branch found!\ncreate one first.`)
  }
  const { branch } = await autocompleteInput('branch',
    branches,
    'select a remote branch to checkout')

  // await $`git reset --hard ${branch}`
  const { stdout, stderr } = await $`git checkout ${branch}`
  stdout && log.greenBox(stdout)
  stderr && log.redBox(stderr)

  await runCommands(cfg.checkout__post)

  return branch
}
