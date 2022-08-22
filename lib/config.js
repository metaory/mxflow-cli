import { stringInput, confirmInput } from './prompts.js'

const CONFIG_DIR = `${os.homedir()}/.config/hgit`
const CONFIG_PATH = `${CONFIG_DIR}/config.json`

export async function getConfig() {
  await fs.ensureDir(CONFIG_DIR)

  const configExist = await fs.pathExists(CONFIG_PATH)
  if (configExist) {
    log.blue(CONFIG_PATH)
    log.blueBox(`Config file found!\n${CONFIG_PATH}`)
    return fs.readJson(CONFIG_PATH)
  }

  log.yellowBox('New System Detected!')

  const { trunk_branch_name } = await stringInput('trunk_branch_name', { value: 'flight' })
  const config = {
    branch_types: ['feature', 'buglist', 'other'],
    trunk_branch_name,
    new_workflow_pre_commands: [
      'git_fetch_origin',
      'git_checkout_master',
      'git_merge_master'
    ],
    commands: {
      git_fetch_origin: 'git fetch origin',
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
