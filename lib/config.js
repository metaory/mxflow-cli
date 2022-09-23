import { numberInput, confirmInput } from './steps/prompts.js'
import { getSampleConfig } from './steps/sample.js'

export function logSleepBetweenConfig({ sleep_between_commands: sleepMs } = cfg) {
  L.warn('sleep_between_commands' + C.yellow.dim(' is set to ') +
    `${C.bold((sleepMs / 1000).toFixed(1))}s`)
}

async function backupConfig(path = CONFIG_PATH) {
  await fs.ensureDir('/tmp/hgit')
  const backup = '/tmp/hgit/config.yml'
  log.yellowDim('keeping a backup in: ')
  log.yellow(backup + '\n')
  return runCommands([`cp ${path} ${backup}`])
}

export async function removeConfig() {
  log.redDim('removing the system config:')
  const path = global.meta === 'local' ? `./.${PKG_NAME}/config.yml` : CONFIG_PATH
  log.red(path + '\n')
  await backupConfig(path)
  await runCommands([`rm -rf ${path}`])
  log.pass('Config removed.')
}

async function writeConfig(config) {
  spinner.start(C.yellow('Saving sample configurations...'))
  await sleep(config.sleep_between_commands)

  const yamlConfig = YAML.stringify(config)
  logYaml(yamlConfig)

  await fs.writeFile(CONFIG_PATH, yamlConfig)
  spinner.succeed('Saved sample configurations.')
  log.greyDim(fillFrom('━'))
  log.pass(REL_CONFIG_PATH, 'was created!')

  L.warn(C.yellow.dim('local copy ') + LOCAL_CONFIG_PATH)

  const { makeCopy } = await confirmInput('makeCopy', 'make a local copy?')
  if (makeCopy) {
    await runCommands([
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

async function hasConfig() {
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

  const existingConfig = await hasConfig()
  if (existingConfig) {
    return existingConfig
  }

  head(import.meta, 'new system')

  log.yellowBox('New System!')

  const { sleepBetweenCommands } = await numberInput('sleepBetweenCommands', {
    value: 1000, hint: '(milliseconds)'
  })

  const { promptSamples } = await confirmInput('promptSamples', 'add sample git-flow?')
  let sampleConfig = {}
  if (promptSamples) {
    sampleConfig = await getSampleConfig()
  }

  const config = {
    config_version: PKG_VERSION,
    sleep_between_commands: sleepBetweenCommands,
    workflows: {
      foobar: {
        description: 'example placeholder',
        pattern: '{branchType}/{taskId}-{description}',
        steps: ['echo hello word', 'echo goodbye cruel world']
      }
    },
    ...sampleConfig
  }

  await writeConfig(config, sleepBetweenCommands)

  log.pass(REL_CONFIG_PATH, 'was loaded!')

  return config
}
