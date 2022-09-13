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
    log.yellowBox('✖ directory is dirty!')
    await $`git status --short`
    log.info('stash your changes', 'before continuing.')
    log.green('$ git stash push')
    process.exit(1)
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
    log.redBox('Older config detected.')
    log.red('removing the config...')
    log.yellow(`keeping a backup in: ${backup}`)
    await $`cp ${CONFIG_PATH} ${backup}`
    await $`rm -rf ${CONFIG_PATH}`
    log.grey('you may run the cli again')
    process.exit()
  }
}
