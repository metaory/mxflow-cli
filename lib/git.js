import { spinner } from 'zx/experimental'

export async function getCurrentBranch() {
  const { stdout } = await $`git branch --show-current`
  return stdout.replace(/[\r\n]/gm, '')
}

export async function checkDirty() {
  try {
    await $`git diff --quiet`
    return false
  } catch (error) {
    return true
  }
}
export async function checkConflict (currentBranch, targetBranch) {
  console.log('comparing', chalk.blue(currentBranch), chalk.yellow(targetBranch))
  try {
    await spinner(chalk.cyan('git reset to master'),
      () => $`git reset --hard master`)
    await spinner(chalk.cyan(`merging ${targetBranch}`),
      () => $`git merge ${targetBranch} --no-commit`)
    await spinner(chalk.cyan('aborting merge'),
      () => $`git merge --abort`)
    // await $`git reset --hard master`
    // await $`git merge ${targetBranch} --no-commit`
    // await $`git merge --abort`
    return false
  } catch (error) {
    await spinner(chalk.cyan('aborting merge'),
      () => $`git merge --abort || true`)
    // await $`git merge --abort || true`
    return true
  }
}
