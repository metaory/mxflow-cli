import { checkDirty } from './git.js'

export async function catchNoGit() {
  try {
    await $([cfg.commands.git_is_inside_worktree])
    return true
  } catch (error) {
    info(error)
    log.redBox('NOT A GIT REPOSITORY!')
    process.exit(1)
  }
}

export async function catchDirtyGit() {
  if (await checkDirty() === true) {
    log.yellowBox('directory is dirty!')
    await $`git status --short`
    log.cyan('stash your changes before continuing.')
    log.green('$ git stash push')
    process.exit(1)
  }
  log.green('directory is clean. \n')
}
