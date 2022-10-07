import { resolve } from 'node:path'
import { numberInput, confirmInput } from './steps/prompts.js'
import SampleConfig from './steps/sample.js'

async function backupConfig() {
  const path = getConfigPath()
  await fs.ensureDir('/tmp/mxflow')
  const backup = '/tmp/mxflow/config.yml'
  log.yellowDim('keeping a backup in: ')
  log.yellow(backup + '\n')
  return $$([`cp ${path} ${backup}`])
}

export async function removeConfig() {
  const path = getConfigPath()
  log.redDim('removing the config:')
  log.red(path + '\n')
  await backupConfig()
  await $$([`rm -rf ${path}`])
  log.pass('Config removed.')
}

async function writeConfig(config) {
  spinner.start(C.yellow('Saving configurations...'))

  await sleep(config.sleep)

  const path = resolve(`${os.homedir()}/.mxflow/config.yml`)
  const localPath = resolve('./.mxflow/config.yml')

  await fs.ensureDir(`${os.homedir()}/.mxflow`)

  const yamlConfig = YAML.stringify(config)
  logYaml(yamlConfig)

  await fs.writeFile(path, yamlConfig)

  spinner.succeed('Saved sample configurations.')
  log.greyDim(fillFrom('━'))
  log.pass(path, 'was created!')

  L.warn(C.yellow.dim('local copy ') + localPath)

  const { makeCopy } = await confirmInput('makeCopy', 'make a local copy?')
  if (makeCopy) {
    await $$([
      `mkdir ./.${PKG_NAME} || true`,
      `cp ${path} ${localPath}`
    ])
  }
}

export async function resetConfig() {
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
    sampleConfig = await SampleConfig()
  }

  const config = {
    version: PKG_VERSION,
    sleep: sleepBetweenCommands,
    workflows: {
      foobar: {
        description: 'example placeholder',
        steps: ['echo hello word', 'echo goodbye cruel world', 'confirm echo goodbye']
      }
    },
    ...sampleConfig
  }

  await writeConfig(config)

  L.loading('config', 'was loaded!')

  return config
}

export function getConfigPath() {
  function traverse(dir = process.cwd()) {
    const path = resolve(dir, './.mxflow/config.yml')
    $.verbose && L.loading('config', path)
    if (fs.pathExistsSync(path)) {
      L.warn(path)
      return path
    } else {
      const segments = dir.split('/')
      segments.pop()
      const upDir = segments.join('/')
      if (!upDir) {
        L.warn('config file not found')
        // exitIfNotFound && L.error(path)
        return
      }
      return traverse(upDir)
    }
  }
  return traverse()
}

function getExistingConfig() {
  const configPath = getConfigPath()

  if (!configPath) return false

  head(import.meta, configPath)

  return loadConfig(configPath)
}

export function getConfig() {
  const existingConfig = getExistingConfig()
  if (existingConfig) {
    return existingConfig
  }

  return collectConfig()
}
