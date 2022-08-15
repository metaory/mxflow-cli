import { stringInput } from './prompts.js'

const CONFIG_DIR = `${os.homedir()}/.config/hgit`
const CONFIG_PATH = `${CONFIG_DIR}/config.json`

export async function getConfig () {
  await fs.ensureDir(CONFIG_DIR)

  const configExist = await fs.pathExists(CONFIG_PATH)
  if (configExist === false) {
    log.yellowBox('New System Detected!')

    let { trunk_branch_name } = await stringInput('trunk_branch_name', { value: 'flight' })
    const config = { 
      trunk_branch_name,
      commands: {
        git_is_inside_worktree: 'git rev-parse --is-inside-work-tree',
        git_fetch: 'git fetch origin',
        git_reset_master: 'git reset --hard master',
        git_reset_head: 'git reset --hard HEAD~1',
        git_merge: 'git merge',
        git_merge_abort: 'git merge --abort || true',
        git_is_dirty: 'git status --short'
      } 
    }
    await fs.writeJson(CONFIG_PATH, config, { spaces: 2 })

    log.cyan(chalk.blue(CONFIG_PATH), 'was created!')

    return config
  }

  return fs.readJson(CONFIG_PATH)
}
