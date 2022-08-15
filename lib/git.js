
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

  // try {
  //   await cd('hgit-worktree')
  //   log.successBox('found hgit-worktree')
  // } catch (err) {
  //   log.warnBox('adding hgit-worktree ...')
  //   await $`git worktree add hgit-worktree`
  // }

  try {
    await $`git reset --hard master`
    await $`git merge ${targetBranch}`
    log.successBox(`✅ no conflict with ${targetBranch}`)
    await $`git reset --hard HEAD~1`
  } catch (error) {
    await $`git merge --abort || true`
  }
}
