import { checkDirty } from './git.js'
import { removeConfig } from './config.js'

export async function catchNoGit() {
  try {
    cfg && await $([cfg.commands.git_is_inside_worktree])
    return true
  } catch (error) {
    info(error)
    log.fatal('not inside a', 'worktree')
  }
}

export async function catchDirtyGit() {
  if (await checkDirty() === true) {
    await $`git status --short`
    log.info('stash your changes', 'before continuing:')
    log.green('$ git stash push\n')
    log.fatal('worktree', 'is dirty')
  }
  log.pass(process.cwd(), 'directory is clean!')
  log.greyDim(fillFrom('━'))
}

export async function catchOldConfig(config) {
  const [, pkgMinorVersion] = PKG_VERSION.split('.')
  const [, cfgMinorVersion] = (config.config_version || '').split('.')
  const oldConfig = 'config_version' in config === false
  const minorVersionMissmatch = cfgMinorVersion &&
    pkgMinorVersion !== cfgMinorVersion

  if (oldConfig || minorVersionMissmatch) {
    await removeConfig()
    log.grey('you may run the cli again\n')
    log.fatal('different config_version minor',
      `${PKG_VERSION} (${C.bold.yellow(config.config_version)})`)
  }
}
