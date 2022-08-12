const CONFIG_DIR = `${os.homedir()}/.config/jgit`
const CONFIG_PATH = `${CONFIG_DIR}/config.json`

export async function getConfig() {
  await fs.ensureDir(CONFIG_DIR)

  const configExist = await fs.pathExists(CONFIG_PATH)

  if (configExist === false) {
    const defaultConfig = {
      trunk_branch_name: 'flight'
    }
    await fs.writeJson(CONFIG_PATH, defaultConfig, { spaces: 2 })
    return defaultConfig
  }

  return fs.readJson(CONFIG_PATH)
}
