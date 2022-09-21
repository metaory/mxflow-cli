import yaml from 'js-yaml'
import { highlight } from 'cli-highlight'
import { numberInput, confirmInput } from './steps/prompts.js'
import { getSampleConfig } from './steps/sample.js'

export function logSleepBetweenConfig({ sleep_between_commands: sleepMs } = cfg) {
  L.warn('sleep_between_commands' + C.yellow.dim(' is set to ') +
    `${C.bold((sleepMs / 1000).toFixed(1))}s`)
}

async function backupConfig() {
  await fs.ensureDir('/tmp/hgit')
  const backup = '/tmp/hgit/config.yml'
  log.yellow(`keeping a backup in: ${backup}`)
  await $`cp ${CONFIG_PATH} ${backup}`
}

export async function removeConfig() {
  log.red('removing the config...')
  await backupConfig()
  await $`rm -rf ${CONFIG_PATH}`
  log.pass('Config removed.')
}

async function writeConfig(config) {
  spinner.start(C.yellow('Saving sample configurations...'))
  await sleep(config.sleep_between_commands)

  const yamlConfig = yaml.dump(config, { sortKeys: true })
  await fs.writeFile(CONFIG_PATH, yamlConfig)
  spinner.succeed('Saved sample configurations.')

  logYaml(yamlConfig)

  log.greyDim(fillFrom('━'))
  log.pass(REL_CONFIG_PATH, 'was created!')
}

export async function resetConfig() {
  log.blue(REL_CONFIG_PATH + '\n')

  const { resetConfig } = await confirmInput('resetConfig')
  if (resetConfig === false) return

  await removeConfig()
}

export async function getConfig() {
  head(import.meta)
  await fs.ensureDir(CONFIG_DIR)

  const configExist = await fs.pathExists(CONFIG_PATH)
  if (configExist) {
    log.pass(REL_CONFIG_PATH, 'was loaded!')
    const file = await fs.readFile(CONFIG_PATH, 'utf8')

    return yaml.load(file)
  }

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
        branch_pattern: '{branchType}/TODO_CHANGE_ME__{taskId}-{description}',
        steps: ['echo hello word', 'echo goodbye cruel world']
      }
    },
    ...sampleConfig
  }

  await writeConfig(config, sleepBetweenCommands)

  log.pass(REL_CONFIG_PATH, 'was loaded!')

  return config
}
