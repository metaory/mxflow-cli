import { spinner } from 'zx/experimental'

export async function getCurrentBranch () {
  const { stdout } = await $`git branch --show-current`
  return stdout.replace(/[\r\n]/gm, '')
}

export async function checkDirty () {
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
    await $`git reset --hard master`
    await $`git merge --no-commit --no-ff ${targetBranch}`
    await $`git reset --hard HEAD~1`
    return { targetBranch, ok: false }
  } catch (error) {
    $.verbose && console.error(error)
    await $`git merge --abort || true`
    return { targetBranch, ok: true }
  }
}

export async function listRemoteBranches () {
  const { stdout } = await $`git branch -r`
  console.log(1, stdout)
  console.log(2, stdout.split('\n').filter(x => x))
  return stdout.split('\n').filter(x => x)
}
