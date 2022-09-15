import { highlight } from 'cli-highlight'
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
    git_fetch_origin: 'git fetch origin || true',
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
    git_status: 'git status'
    // git_latest_log: 'git log --graph --pretty="%Cred%h%Creset -%C(auto)%d%Creset %s %Cgreen(%ar) %C(bold blue)<%an>%Creset" -10'
  },
  checkout: ['git_fetch_origin', 'git_checkout_branch', 'git_status']
}

// ---

export async function getConfig() {
  await fs.ensureDir(CONFIG_DIR)

  const configExist = await fs.pathExists(CONFIG_PATH)
  if (configExist) {
    log.positive(CONFIG_PATH, 'was loaded!')
    return fs.readJson(CONFIG_PATH)
  }

  log.yellowBox('New System Detected!')

  const { trunkBranchName } = await stringInput('trunkBranchName', { value: 'flight' })

  // TODO use https://github.com/enquirer/enquirer#list-prompt
  const { branch_types: branchTypesStr } = await stringInput('branch_types', {
    message: 'comma separated branch types',
    value: 'feature, bugfix, other, hotfix',
    spaceReplacer: ' '
  })

  const branchTypes = Object.freeze(
    branchTypesStr
      .split(',')
      .map(x => x.trim())
      .map(x => x.replaceAll(' ', '_'))
  )

  const { trunkBased } = await multiselectInput(
    'trunkBased',
    [...branchTypes],
    `select branches that starts from ${trunkBranchName}`,
    branchTypes.length > 3 ? [0, 1, 2] : 0
  )

  const defaultBranchPattern = '{branchType}/{taskId}-{description}'
  const defaultTrunkPattern = `${trunkBranchName}/{description}`

  const workflowCommands = ['default', 'feature', 'bugfix', 'hotfix', 'other']
    .reduce((acc, cur) => ({ ...acc, [cur]: defaultWorkflowCommands }),
      { [trunkBranchName]: defaultWorkflowCommands })

  const startWorkflowConfig = [trunkBranchName, ...branchTypes].reduce((acc, cur) => {
    acc[cur] = workflowCommands[cur] || workflowCommands.default

    acc[cur + '__branch_pattern'] = cur === trunkBranchName
      ? defaultTrunkPattern
      : defaultBranchPattern

    if (trunkBased.includes(cur)) {
      acc[cur] = [...acc[cur], `prompt_checkout_${trunkBranchName}`, 'git_create_branch', 'git_status']
    } else {
      acc[cur] = [...acc[cur], 'git_create_branch', 'git_status']
    }

    return acc
  }, {})

  const { sleepBetweenCommands } = await numberInput('sleepBetweenCommands', {
    value: 1000, hint: '(milliseconds)'
  })

  const { graphGitLogLimit } = await numberInput('graphGitLogLimit', {
    value: 40, hint: '(rows)'
  })

  const { isJira } = await toggleInput('isJira', 'select a bugTracker', {
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
    branch_types: branchTypes,
    trunk_branch_name: trunkBranchName,
    sleep_between_commands: sleepBetweenCommands,
    graph_git_log_limit: graphGitLogLimit,
    bug_tracker_path: isJira
      ? `https://${jiraTenant}.atlassian.net/browse/{taskId}`
      : `https://app.clickup.com/t/${clickupTenant}/{taskId}`,
    ...defaultConfig,
    start_workflow: startWorkflowConfig
  }

  await fs.writeJson(CONFIG_PATH, config, { spaces: 2 })

  console.log(highlight(JSON.stringify(config, null, 2)))
  log.greyDim(fillFrom('━'))
  log.positive(CONFIG_PATH, 'was created!')

  return config
}

export async function resetConfig() {
  log.blue(CONFIG_PATH + '\n')

  const { resetConfig } = await confirmInput('resetConfig')
  if (resetConfig === false) return

  $`rm -rf ${CONFIG_PATH}`
  log.danger('Config removed.')
}
