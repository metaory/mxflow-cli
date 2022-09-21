import { stringInput, numberInput, toggleInput, multiselectInput } from './prompts.js'

const defaultWorkflowCommands = [
  'git fetch origin',
  'git checkout master',
  'git merge origin/master'
]

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

export async function getSampleConfig() {
  head(import.meta, 'git flow')
  const bugTrackerPath = await getBugTrackerPath()
  const { trunkBranchName } = await stringInput('trunkBranchName', { value: 'flight' })

  const branchTypes = await getBranchTypes()

  const startWorkflowConfig = await getStartWorkflowConfig(trunkBranchName, branchTypes)

  const { graphGitLogLimit } = await numberInput('graphGitLogLimit', {
    value: 40, hint: '(rows)'
  })

  return {
    workflows: startWorkflowConfig,
    graph_git_log_limit: graphGitLogLimit,
    bug_tracker_path: bugTrackerPath
  }
}
