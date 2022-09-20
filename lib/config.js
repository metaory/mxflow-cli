import yaml from 'js-yaml'
import { stringInput, numberInput, toggleInput, confirmInput, multiselectInput } from './prompts.js'

const defaultWorkflowCommands = [
  'git fetch origin',
  'git checkout master',
  'git merge origin/master'
]

export function logSleepBetweenConfig({ sleep_between_commands: sleepMs } = cfg) {
  L.warn('sleep_between_commands' + C.yellow.dim(' is set to ') +
    `${C.bold((sleepMs / 1000).toFixed(1))}s`)
}

async function writeConfig(config) {
  spinner.start(C.yellow('Saving configurations...'))
  await sleep(config.sleep_between_commands)

  await fs.writeFile(CONFIG_PATH, yaml.dump(config))

  console.log('\n', config)

  spinner.succeed('Saved configurations.')

  log.greyDim(fillFrom('━'))
  log.pass(REL_CONFIG_PATH, 'was created!')
}

async function backupConfig() {
  const backup = '/tmp/hgit.json'
  log.yellow(`keeping a backup in: ${backup}`)
  await $`cp ${CONFIG_PATH} ${backup}`
}

async function getBranchTypes() {
  // TODO use https://github.com/enquirer/enquirer#list-prompt
  const { branch_types: branchTypesStr } = await stringInput('branch_types', {
    message: `comma separated ${C.bold('branch types')}`,
    value: 'feature, bugfix, other, hotfix',
    spaceReplacer: ' '
  })

  return Object.freeze(
    branchTypesStr
      .split(',')
      .map(x => x.trim())
      .map(x => x.replaceAll(' ', '_'))
  )
}

export async function removeConfig() {
  log.red('removing the config...')
  await backupConfig()
  await $`rm -rf ${CONFIG_PATH}`
  log.pass('Config removed.')
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
  log.greenDim(C.bold('configurations:'))

  const { trunkBranchName } = await stringInput('trunkBranchName', { value: 'flight' })

  const branchTypes = await getBranchTypes()

  const startWorkflowConfig = await getStartWorkflowConfig(trunkBranchName, branchTypes)

  const { sleepBetweenCommands } = await numberInput('sleepBetweenCommands', {
    value: 3000, hint: '(milliseconds)'
  })

  const { graphGitLogLimit } = await numberInput('graphGitLogLimit', {
    value: 40, hint: '(rows)'
  })

  const bugTrackerPath = await getBugTrackerPath()

  const config = {
    config_version: PKG_VERSION,
    trunk_branch_name: trunkBranchName,
    sleep_between_commands: sleepBetweenCommands,
    graph_git_log_limit: graphGitLogLimit,
    bug_tracker_path: bugTrackerPath,
    start_workflow: startWorkflowConfig
  }

  await writeConfig(config, sleepBetweenCommands)

  log.pass(REL_CONFIG_PATH, 'was loaded!')

  return config
}

const getBugTrackerPath = async() => {
  const { bugTracker: isJira } = await toggleInput('bugTracker', {
    enabled: 'Jira', disabled: 'ClickUp'
  })

  if (isJira) {
    const { jiraTenant } = await stringInput('jiraTenant', {
      value: 'metaory', hint: '(tenant name)'
    })
    return `https://${jiraTenant}.atlassian.net/browse/{taskId}`
  }

  const { clickupTenant } = await numberInput('clickupTenant', {
    value: 14288054, hint: '(tenant id)'
  })
  return `https://app.clickup.com/t/${clickupTenant}/{taskId}`
}

const getStartWorkflowConfig = async(trunkBranchName, branchTypes) => {
  const defaultBranchPattern = '{branchType}/{taskId}-{description}'
  const defaultTrunkPattern = `${trunkBranchName}/{description}`
  const workflowCommands = getWorkflowCommands(trunkBranchName, defaultWorkflowCommands)
  const { trunkBased } = await getTrunkBased(branchTypes, trunkBranchName)

  return [trunkBranchName, ...branchTypes].reduce((acc, cur) => {
    acc[cur + '__branch_pattern'] = cur === trunkBranchName
      ? defaultTrunkPattern
      : defaultBranchPattern
    acc[cur] = workflowCommands[cur] || workflowCommands.default

    if (trunkBased.includes(cur)) {
      acc[cur] = [
        ...acc[cur],
        'confirm git fetch origin',
        `autocomplete checkout ${trunkBranchName}`,
        'git checkout -b {branchName}',
        'git status',
        'confirm git push --set-upstream origin {branchName}',
        'list logs'
      ]
    } else {
      acc[cur] = [
        ...acc[cur],
        'confirm git fetch --all',
        'git checkout -b {branchName}',
        'git status',
        'confirm git push --set-upstream origin {branchName}',
        'list logs'
      ]
    }

    return acc
  }, {})
}

const getTrunkBased = (branchTypes, trunkBranchName) => multiselectInput(
  'trunkBased',
  [...branchTypes],
  `select ${C.bold('child branches')} for ${C.bold(trunkBranchName)}`,
  branchTypes.length > 3 ? [0, 1, 2] : 0
)

const getWorkflowCommands = (trunkBranchName, defaultCommands) =>
  ['default', 'feature', 'bugfix', 'hotfix', 'other']
    .reduce((acc, cur) => ({ ...acc, [cur]: defaultCommands }),
      { [trunkBranchName]: defaultCommands })
