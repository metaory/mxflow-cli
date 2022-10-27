import { resolve } from 'node:path'
import { numberInput, confirmInput } from './steps/prompts.js'
import SampleConfig from './steps/sample.js'
import findFile from 'simple-find-file-recursively-up'

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
  spinner.start(C.yellow('configuring...'))

  await sleep(config.sleep)

  const path = resolve(`${os.homedir()}/.mxflow/config.yml`)
  const localPath = resolve('./.mxflow/config.yml')

  const yamlConfig = YAML.stringify(config)
  logYaml(yamlConfig)
  spinner.succeed('configured.')

  L.warn(C.yellow.dim('system config ') + path)
  const { makeSystemCopy } = await confirmInput('makeSystemCopy', 'make a system copy?')
  if (makeSystemCopy) {
    await fs.ensureDir(`${os.homedir()}/.mxflow`)
    await fs.writeFile(path, yamlConfig)
    log.greyDim(fillFrom('━'))
    log.pass(path, 'was created!')
  }

  L.warn(C.yellow.dim('local config ') + localPath)
  const { makeLocalCopy } = await confirmInput('makeLocalCopy', 'make a local copy?')
  if (makeLocalCopy) {
    await fs.ensureDir('./.mxflow')
    await fs.writeFile(localPath, yamlConfig)
  }
}

export async function resetConfig() {
  const { resetSystemConfig } = await confirmInput('resetSystemConfig')
  if (resetSystemConfig === false) return

  return removeConfig()
}

async function loadConfig(path) {
  const file = await fs.readFile(path, 'utf8')

  $.verbose && log.pass(path, 'was loaded!')
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
    exit_on_error: false,
    workflows: {
      foobar: {
        description: 'example placeholder',
        args: [
          { name: 'foo', type: 'string' },
          { name: 'bar', type: 'string', regex: '^bar+\\w', default: 'bdef', export: 'barx' }
          // { name: 'MXF_BUG_TRACKER_NAME', type: 'env', default: 'jira', export: 'bugTrackerName' }
        ],
        steps: ['echo hello {current-branch} {foo} world', 'echo goodbye {foo} {barx} cruel world', 'confirm echo {barx} goodbye', 'echo "AWS_PROFILE: {AWS_PROFILE}"']
      }
    },
    ...sampleConfig
  }

  await writeConfig(config)

  L.loading('config', 'was loaded!')

  return config
}

export const getConfigPath = () => findFile('.mxflow/config.yml')

function getExistingConfig() {
  const configPath = getConfigPath()

  if (!configPath) return false

  head(import.meta, configPath)

  return loadConfig(configPath)
}

export function getConfig() {
  const existingConfig = getExistingConfig()
  const isInit = argv.init || argv._.includes('init')
  if (isInit === false && existingConfig) {
    return existingConfig
  }

  return collectConfig()
}
