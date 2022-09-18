import { stringInput, numberInput, toggleInput, confirmInput, multiselectInput } from './prompts.js'

const defaultWorkflowCommands = [
  'git_fetch_origin',
  'git_checkout_master',
  'git_merge_master'
]

const defaultConfig = {
  commands: {
    git_push_origin: 'git push --set-upstream origin {branchName}',
    git_checkout_branch: 'git checkout {branchName}',
    git_create_branch: 'git checkout -b {branchName}',
    git_fetch_origin: 'git fetch origin',
    git_checkout_dev: 'git checkout dev',
    git_merge_dev: 'git merge origin/dev',
    git_checkout_master: 'git checkout master',
    git_merge_master: 'git merge origin/master',
    git_is_inside_worktree: 'git rev-parse --is-inside-work-tree',
    git_prune: 'git gc --prune=now && git remote prune origin',
    git_reset_master: 'git reset --hard master',
    git_reset_head: 'git reset --hard HEAD~1',
    git_merge_abort: 'git merge --abort || true',
    git_is_dirty: 'git status --short',
    git_status: 'git status',
    git_workflow_add: 'git worktree add -b {branchName} {path} {origin}',
    git_workflow_list: 'git worktree list'
    // git_latest_log: 'git log --graph --pretty="%Cred%h%Creset -%C(auto)%d%Creset %s %Cgreen(%ar) %C(bold blue)<%an>%Creset" -10'
  },
  checkout: ['git_fetch_origin', 'git_checkout_branch', 'git_status']
}

async function writeConfig(config) {
  L.warn(C.bold('sleep_between_commands') + ' is set to ' +
    `${C.cyan((config.sleep_between_commands / 1000).toFixed(2))} seconds`)

  spinner.start(C.yellow('Saving configurations...'))
  await sleep(config.sleep_between_commands)

  await fs.writeJson(CONFIG_PATH, config, { spaces: 2 })

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
    return fs.readJson(CONFIG_PATH)
  }

  log.yellowBox('New System!')
  log.greenDim(C.bold('configurations:'))

  const { trunkBranchName } = await stringInput('trunkBranchName', { value: 'flight' })

  const branchTypes = await getBranchTypes()

  const { trunkBased } = await multiselectInput(
    'trunkBased',
    [...branchTypes],
    `select ${C.bold('child branches')} for ${C.bold(trunkBranchName)}`,
    branchTypes.length > 3 ? [0, 1, 2] : 0
  )

  const defaultBranchPattern = '{branchType}/{taskId}-{description}'
  const defaultTrunkPattern = `${trunkBranchName}/{description}`

  const workflowCommands = ['default', 'feature', 'bugfix', 'hotfix', 'other']
    .reduce((acc, cur) => ({ ...acc, [cur]: defaultWorkflowCommands }),
      { [trunkBranchName]: defaultWorkflowCommands })

  const startWorkflowConfig = [trunkBranchName, ...branchTypes].reduce((acc, cur) => {
    acc[cur + '__branch_pattern'] = cur === trunkBranchName
      ? defaultTrunkPattern
      : defaultBranchPattern
    acc[cur] = workflowCommands[cur] || workflowCommands.default

    if (trunkBased.includes(cur)) {
      acc[cur] = [
        ...acc[cur],
        `prompt_checkout__${trunkBranchName}`,
        'git_create_branch',
        'git_status'
      ]
    } else {
      acc[cur] = [
        ...acc[cur],
        'git_create_branch',
        'git_status'
      ]
    }

    return acc
  }, {})

  const { sleepBetweenCommands } = await numberInput('sleepBetweenCommands', {
    value: 3000, hint: '(milliseconds)'
  })

  const { graphGitLogLimit } = await numberInput('graphGitLogLimit', {
    value: 40, hint: '(rows)'
  })

  const { bugTracker: isJira } = await toggleInput('bugTracker', {
    enabled: 'Jira', disabled: 'ClickUp'
  })

  let jiraTenant, clickupTenant
  if (isJira) {
    jiraTenant = (await stringInput('jiraTenant', {
      value: 'metaory', hint: '(tenant name)'
    })).jiraTenant
  } else {
    clickupTenant = (await numberInput('clickupTenant', {
      value: 14288054, hint: '(tenant id)'
    })).clickupTenant
  }

  const config = {
    config_version: PKG_VERSION,
    trunk_branch_name: trunkBranchName,
    sleep_between_commands: sleepBetweenCommands,
    graph_git_log_limit: graphGitLogLimit,
    bug_tracker_path: isJira
      ? `https://${jiraTenant}.atlassian.net/browse/{taskId}`
      : `https://app.clickup.com/t/${clickupTenant}/{taskId}`,
    ...defaultConfig,
    start_workflow: startWorkflowConfig
  }

  await writeConfig(config, sleepBetweenCommands)

  log.pass(REL_CONFIG_PATH, 'was loaded!')

  return config
}
