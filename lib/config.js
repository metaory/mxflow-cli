import { highlight } from 'cli-highlight'
import { stringInput, confirmInput, multiselectInput } from './prompts.js'

const startWorkflowPreTemplate = [
  'git_fetch_origin',
  'git_checkout_master',
  'git_merge_master'
]
const startWorkflowPostTemplate = ['git_latest_log']

const defaultConfig = {
  checkout__pre: ['git_fetch_origin'],
  commands: {
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
    git_status: 'git status',
    git_latest_log: 'git log --graph --pretty="%Cred%h%Creset -%C(auto)%d%Creset %s %Cgreen(%ar) %C(bold blue)<%an>%Creset" -10'
  }
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

  const { trunk_branch_name } = await stringInput('trunk_branch_name', { value: 'flight' })

  const { branch_types: branchTypesStr } = await stringInput('branch_types', {
    message: 'comma separated branch types',
    value: 'feature, bugfix, hotfix, other',
    spaceReplacer: ' '
  })

  const branchTypes = Object.freeze(
    branchTypesStr
      .split(',')
      .map(x => x.trim())
      .map(x => x.replaceAll(' ', '_'))
  )

  const { trunk_based } = await multiselectInput(
    'trunk_based',
    [...branchTypes],
    `select branches that starts from ${trunk_branch_name}`,
    [0]
  )

  const workflowCommands = {
    default__pre: startWorkflowPreTemplate,
    default__post: startWorkflowPostTemplate,
    [trunk_branch_name + '__pre']: startWorkflowPreTemplate,
    [trunk_branch_name + '__post']: startWorkflowPostTemplate,
    feature__pre: startWorkflowPreTemplate,
    bugfix__pre: startWorkflowPreTemplate,
    hotfix__pre: startWorkflowPreTemplate,
    other__pre: startWorkflowPreTemplate
  }

  const startWorkflowConfig = [...branchTypes, trunk_branch_name].reduce((acc, cur) => {
    acc[cur + '__pre'] = workflowCommands[cur + '__pre'] ||
      workflowCommands.default__pre

    acc[cur + '__post'] = workflowCommands[cur + '__post'] ||
      workflowCommands.default__post

    if (trunk_based.includes(cur)) {
      acc[cur + '__pre'] = [...new Set([
        ...acc[cur + '__pre'], `git_pick_${trunk_branch_name}`
      ])]
    }
    return acc
  }, {})

  const config = {
    config_version: PKG_VERSION,
    trunk_branch_name,
    start_workflow: startWorkflowConfig,
    branch_types: branchTypes,
    ...defaultConfig
  }

  await fs.writeJson(CONFIG_PATH, config, { spaces: 2 })

  console.log(highlight(JSON.stringify(config, null, 2)))
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
