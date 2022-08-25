import { stringInput, confirmInput } from './prompts.js'

global.CONFIG_DIR = `${os.homedir()}/.config/hgit`
global.CONFIG_PATH = `${CONFIG_DIR}/config.json`

export async function getConfig() {
  await fs.ensureDir(CONFIG_DIR)

  const configExist = await fs.pathExists(CONFIG_PATH)
  if (configExist) {
    log.blue(`Config file found!\n${CONFIG_PATH}`)
    return fs.readJson(CONFIG_PATH)
  }

  log.yellowBox('New System Detected!')

  const defaultStartWorkflowPreCommands = {
    feature: [
      'git_fetch_origin',
      'git_checkout_dev',
      'git_merge_dev'
    ],
    bugfix: [
      'git_fetch_origin',
      'git_checkout_master',
      'git_merge_master'
    ],
    other: [
      'git_fetch_origin',
      'git_checkout_master',
      'git_merge_master'
    ]
  }

  const { trunk_branch_name } = await stringInput('trunk_branch_name', { value: 'flight' })
  const { branch_types: branchTypesStr } = await stringInput('branch_types', {
    message: 'comma separated branch types',
    value: 'feature, buglist, other'
  })
  const branchTypes = branchTypesStr.split(',').map(x => x.trim())

  const startWorkflowConfig = branchTypes.reduce((acc, cur) => {
    acc[cur] = defaultStartWorkflowPreCommands[cur] ||
      defaultStartWorkflowPreCommands.feature
    return acc
  }, {})

  const config = {
    config_version: PKG_VERSION,
    branch_types: branchTypes,
    trunk_branch_name,
    start_workflow: startWorkflowConfig,
    commands: {
      git_fetch_origin: 'git fetch origin',
      git_checkout_dev: 'git checkout dev',
      git_merge_dev: 'git merge origin/dev',
      git_checkout_master: 'git checkout master',
      git_merge_master: 'git merge origin/master',
      git_is_inside_worktree: 'git rev-parse --is-inside-work-tree',
      // git_fetch: 'git fetch origin',
      // git_reset_master: 'git reset --hard master',
      // git_reset_head: 'git reset --hard HEAD~1',
      // git_merge: 'git merge',
      // git_merge_abort: 'git merge --abort || true',
      // git_is_dirty: 'git status --short'
    }
  }
  await fs.writeJson(CONFIG_PATH, config, { spaces: 2 })

  log.cyan(`${chalk.blue(CONFIG_PATH)} was created!`)

  return config
}

export async function resetConfig() {
  log.blue(CONFIG_PATH + '\n')
  const { resetConfig } = await confirmInput('resetConfig')
  if (resetConfig === false) return
  $`rm -rf ${CONFIG_PATH}`
  log.redBox('Config removed.')
}
