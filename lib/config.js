import { numberInput, confirmInput } from './steps/prompts.js'
import { getSampleConfig } from './steps/sample.js'

async function backupConfig(path = CONFIG_PATH) {
  await fs.ensureDir('/tmp/mxflow')
  const backup = '/tmp/mxflow/config.yml'
  log.yellowDim('keeping a backup in: ')
  log.yellow(backup + '\n')
  return $$([`cp ${path} ${backup}`])
}

export async function removeConfig() {
  log.redDim('removing the system config:')
  const localExists = await fs.exists(LOCAL_CONFIG_PATH)
  const path = localExists ? LOCAL_CONFIG_PATH : CONFIG_PATH
  log.red(path + '\n')
  await backupConfig(path)
  await $$([`rm -rf ${path}`])
  log.pass('Config removed.')
}

async function writeConfig(config) {
  spinner.start(C.yellow('Saving sample configurations...'))
  await sleep(config.sleep)

  const yamlConfig = YAML.stringify(config)
  logYaml(yamlConfig)

  await fs.writeFile(CONFIG_PATH, yamlConfig)
  spinner.succeed('Saved sample configurations.')
  log.greyDim(fillFrom('━'))
  log.pass(REL_CONFIG_PATH, 'was created!')

  L.warn(C.yellow.dim('local copy ') + LOCAL_CONFIG_PATH)

  const { makeCopy } = await confirmInput('makeCopy', 'make a local copy?')
  if (makeCopy) {
    await $$([
      `mkdir ./.${PKG_NAME}`,
      `cp ${CONFIG_PATH} ${LOCAL_CONFIG_PATH}`
    ])
  }
}

export async function resetConfig() {
  log.blue(REL_CONFIG_PATH + '\n')

  const { resetSystemConfig } = await confirmInput('resetSystemConfig')
  if (resetSystemConfig === false) return

  return removeConfig()
}

async function loadConfig(path) {
  const file = await fs.readFile(path, 'utf8')
  log.pass(path, 'was loaded!')
  $.verbose && logYaml(file)
  return YAML.parse(file)
}

async function collectConfig() {
  head(import.meta, 'new system')

  log.yellowBox('New System!')

  const { sleepBetweenCommands } = await numberInput('sleepBetweenCommands', {
    value: 1000, hint: '(milliseconds)', min: 1
  })

  const { promptSamples } = await confirmInput('promptSamples', 'add sample git-flow?')
  let sampleConfig = {}
  if (promptSamples) {
    sampleConfig = await getSampleConfig()
  }

  const config = {
    version: PKG_VERSION,
    // sleep: sleepBetweenCommands,
    workflows: {
      foobar: {
        description: 'example placeholder',
        steps: ['echo hello word', 'echo goodbye cruel world', 'confirm echo goodbye']
      }
    },
    ...sampleConfig
  }

  await writeConfig(config)

  log.pass(REL_CONFIG_PATH, 'was loaded!')

  return config
}

async function getExistingConfig() {
  if (await fs.pathExists(LOCAL_CONFIG_PATH)) {
    head(import.meta, 'local')
    return loadConfig(LOCAL_CONFIG_PATH)
  }

  if (await fs.pathExists(CONFIG_PATH)) {
    head(import.meta, 'system')
    return loadConfig(CONFIG_PATH)
  }
}
export async function getConfig() {
  await fs.ensureDir(CONFIG_DIR)

  const existingConfig = await getExistingConfig()
  if (existingConfig) {
    return existingConfig
  }

  return collectConfig()
}
