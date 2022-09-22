import { checkBranchExists, checkDirty } from './git.js'
import { removeConfig } from './config.js'

export async function catchNoGit() {
  try {
    await $`git rev-parse --is-inside-work-tree`
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
  log.pass(CWD, 'directory is clean!')
  log.greyDim(fillFrom('━'))
}

export async function catchOldConfig(config) {
  const [, pkgMinorVersion] = PKG_VERSION.split('.')
  // TODO what about the ::local config:: version?
  const [, cfgMinorVersion] = (config.config_version || '').split('.')
  const oldConfig = 'config_version' in config === false
  const minorVersionMissmatch = cfgMinorVersion &&
    pkgMinorVersion !== cfgMinorVersion

  if (oldConfig || minorVersionMissmatch) {
    await removeConfig()
    log.grey('you may run the cli again\n')
    log.fatal(
      'different config_version',
      `minor ${PKG_VERSION} (${C.bold.yellow(config.config_version)})`,
      REL_CONFIG_PATH
    )
  }
}

export async function catchBranchExist(branchName) {
  const branchExists = await checkBranchExists(branchName)
  if (branchExists) {
    log.fatal('Branch Name Exists!', branchName)
  }
}
