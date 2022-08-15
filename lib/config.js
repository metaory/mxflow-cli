import { stringInput } from './prompts.js'

const CONFIG_DIR = `${os.homedir()}/.config/hgit`
const CONFIG_PATH = `${CONFIG_DIR}/config.json`

export async function getConfig () {
  await fs.ensureDir(CONFIG_DIR)

  // const gitIgnorePath = `${process.cwd()}/.gitignore`
  // const { stdout: isWorktreeInGitIgnore } = await $`grep hgit-worktree ${gitIgnorePath} || true`
  // if (!isWorktreeInGitIgnore) {
  //   log.info('updating', chalk.yellow(gitIgnorePath), '...')
  //   await $`echo hgit-worktree >> ${gitIgnorePath}`
  // }

  const configExist = await fs.pathExists(CONFIG_PATH)
  if (configExist === false) {
    log.warnBox('New System Detected!')

    let { trunk_branch_name } = await stringInput('trunk_branch_name')
    const config = { trunk_branch_name }
    await fs.writeJson(CONFIG_PATH, config, { spaces: 2 })

    log.info(chalk.blue(CONFIG_PATH), 'was created!')

    return config
  }

  return fs.readJson(CONFIG_PATH)
}
