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
    await $`git merge ${targetBranch}`
    // log.successBox(`✅ no conflict with ${targetBranch}`)
    await $`git reset --hard HEAD~1`
    return false
  } catch (error) {
    await $`git merge --abort || true`
    return true
  }
}
