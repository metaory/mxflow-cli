import { checkDirty } from './git.js'

export async function catchNoGit() {
  try {
    cfg && await $([cfg.commands.git_is_inside_worktree])
    return true
  } catch (error) {
    info(error)
    log.fatal('not inside a', 'worktree', 5)
  }
}

export async function catchDirtyGit() {
  if (await checkDirty() === true) {
    await $`git status --short`
    log.info('stash your changes', 'before continuing:')
    log.green('$ git stash push\n')
    log.fatal('worktree', 'is dirty', 3)
  }
  log.positive(process.cwd(), 'directory is clean!')
  log.greyDim(fillFrom('━'))
}

export async function catchOldConfig(config) {
  const [, pkgMinorVersion] = PKG_VERSION.split('.')
  const [, cfgMinorVersion] = (config.config_version || '').split('.')
  const oldConfig = 'config_version' in config === false
  const minorVersionMissmatch = cfgMinorVersion &&
    pkgMinorVersion !== cfgMinorVersion

  if (oldConfig || minorVersionMissmatch) {
    const backup = '/tmp/hgit.json'
    log.red('removing the config...')
    log.yellow(`keeping a backup in: ${backup}`)
    await $`cp ${CONFIG_PATH} ${backup}`
    await $`rm -rf ${CONFIG_PATH}`
    log.grey('you may run the cli again\n')
    log.fatal('different config_version minor',
      `${PKG_VERSION} (${C.bold.yellow(cfgMinorVersion)})`, 4)
  }
}
