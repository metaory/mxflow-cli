export async function getCurrentBranch() {
  const { stdout } = await $`git branch --show-current`
  return stdout.replace(/[\r\n]/gm, '')
}

export async function checkDirty() {
  try {
    await $`git diff --quiet`
    return false
  } catch (error) {
    info(error)
    return true
  }
}

export async function checkConflict(currentBranch, targetBranch) {
  console.info(
    chalk.grey('comparing'),
    chalk.blue(currentBranch),
    chalk.grey('...'),
    chalk.cyan(targetBranch)
  )
  try {
    await $`git reset --hard HEAD`
    await $`git merge -Xignore-space-change --no-commit --no-ff origin/${targetBranch}`
    await $`git reset --hard HEAD`
    return { targetBranch, conflict: false }
  } catch (error) {
    info(targetBranch, error)
    await $`git merge --abort || true`
    await $`git reset --hard HEAD`
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

// export async function listTrunkBranches() {
//   return (await listRemoteBranches())
//     .filter(x => x.includes(cfg.trunk_branch_name))
// }
