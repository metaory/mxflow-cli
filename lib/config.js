import boxen from 'boxen';
import { stringInput, listInput } from './prompts.js'

const CONFIG_DIR = `${os.homedir()}/.config/jgit`
const CONFIG_PATH = `${CONFIG_DIR}/config.json`

export async function getConfig() {
  await fs.ensureDir(CONFIG_DIR)

  const configExist = await fs.pathExists(CONFIG_PATH)

  if (configExist === false) {
    console.log(chalk.yellow(boxen('New System Detected!', {padding: 1})))

    let { trunk_branch_name } = await stringInput('trunk_branch_name')
    const config = { trunk_branch_name }
    await fs.writeJson(CONFIG_PATH, config, { spaces: 2 })
    return config
  }

  return fs.readJson(CONFIG_PATH)
}
