import { checkDirty } from './git.js'

export async function catchNoGit() {
  try {
    cfg && await $([cfg.commands.git_is_inside_worktree])
    return true
  } catch (error) {
    info(error)
    log.redBox('NOT A GIT REPOSITORY!')
    process.exit(1)
  }
}

export async function catchDirtyGit() {
  if (await checkDirty() === true) {
    log.yellowBox(icons.cross + ' directory is dirty!')
    await $`git status --short`
    log.cyan(icons.info + ' stash your changes before continuing.')
    log.green('$ git stash push')
    process.exit(1)
  }
  log.positive(process.cwd(), 'directory is clean. \n')
}
