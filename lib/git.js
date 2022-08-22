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

export async function checkConflict(currentBranch, targetBranch) {
  console.info('comparing', chalk.blue(currentBranch), '...', chalk.cyan(targetBranch))
  try {
    await $`git reset --hard HEAD`
    await $`git merge --no-commit --no-ff origin/${targetBranch}`
    await $`git reset --hard HEAD`
    return { targetBranch, conflict: false }
  } catch (error) {
    info(targetBranch, error)
    await $`git merge --abort || true`
    return { targetBranch, conflict: true }
  }
}

export async function listRemoteBranches() {
  const { stdout } = await $`git branch -r`
  return stdout
    .split('\n')
    .filter(x => x)
    .map(x => x.trim())
}
