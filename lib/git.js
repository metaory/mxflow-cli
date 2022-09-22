import { spawn } from 'node:child_process'

export async function getCurrentBranch() {
  const { stdout } = await $`git rev-parse --abbrev-ref HEAD || true`
  return stdout.replace(/[\r\n]/gm, '')
}

export async function checkBranchExists(branchName) {
  try {
    await $`git rev-parse --verify ${branchName}`
    return true
  } catch (error) {
    info(error)
    return false
  }
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
    C.grey('comparing'),
    C.blue(currentBranch),
    C.grey('...'),
    C.cyan(targetBranch)
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

export async function listLatestLogs(limit = cfg.graph_git_log_limit) {
  head(import.meta)
  log.info(`press ${C.bold.red('(q)')} to quit logs\n`)
  await sleep(2000)
  return new Promise(resolve => {
    spawn('git', [
      'log',
      '--graph',
      '--pretty="%Cred%h%Creset -%C(auto)%d%Creset %s %Cgreen(%ar) %C(bold blue)<%an>%Creset"',
      `-${limit}`
    ], { stdio: [process.stdin, process.stdout, process.stderr] })
      .on('close', resolve)
  })
}
