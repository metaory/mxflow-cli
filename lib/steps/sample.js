import { stringInput, numberInput, toggleInput, multiselectInput } from './prompts.js'

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

const getIssueTracker = async() => {
  const { bugTracker: isJira } = await toggleInput('bugTracker', {
    enabled: 'Jira', disabled: 'ClickUp', initial: true
  })

  const issueTracker = isJira ? 'jira' : 'clickup'
  let issueTrackerTenant = 'NA'
  if (issueTracker === 'jira') {
    const { jiraTenant } = await stringInput('jiraTenant', {
      value: 'metaory', hint: '(issueTrackerTenant Name)'
    })
    issueTrackerTenant = jiraTenant
  }
  if (issueTracker === 'clickup') {
    const { clickupTenant } = await numberInput('clickupTenant', {
      value: 14288054, hint: '(issueTrackerTenant ID)'
    })
    issueTrackerTenant = clickupTenant
  }
  return { issueTracker, issueTrackerTenant }
}

const getStartWorkflowConfig = async(trunkBranchName, branchTypes) => {
  const defaultBranchPattern = '{branchType}/{taskId}-{description}'
  const defaultTrunkPattern = `${trunkBranchName}/{description}`
  const { trunkBasedBranches } = await getTrunkBased(branchTypes, trunkBranchName)
  const { issueTracker, issueTrackerTenant } = await getIssueTracker()

  const workflowCommands = getWorkflowCommands({
    trunkBranchName,
    branchTypes,
    trunkBasedBranches,
    issueTracker,
    issueTrackerTenant
  })

  return [trunkBranchName, ...branchTypes].reduce((acc, cur) => {
    const branchPattern = cur === trunkBranchName
      ? defaultTrunkPattern
      : defaultBranchPattern

    acc[cur] = {
      description: `${cur} example workflow`,
      pattern: branchPattern,
      steps: workflowCommands[cur]
    }
    return acc
  }, {})
}

const getTrunkBased = (branchTypes, trunkBranchName) => multiselectInput(
  'trunkBasedBranches',
  [...branchTypes],
  `select ${C.bold('child branches')} for ${C.bold(trunkBranchName)}`,
  branchTypes.length > 3 ? [0, 1, 2] : 0
)

const getWorkflowCommands = ({
  trunkBranchName,
  branchTypes,
  trunkBasedBranches,
  issueTracker,
  issueTrackerTenant
}) =>
  [trunkBranchName, ...branchTypes]
    .reduce((acc, cur) => ({
      ...acc,
      [cur]: [
        'git fetch origin',
        'git checkout master',
        'git merge origin/master',
        ...(trunkBasedBranches.includes(cur)
          ? [`autocomplete checkout ${trunkBranchName}`]
          : []),
        'git checkout -b {branchName}',
        'git status',
        'confirm git push --set-upstream origin {branchName}',
        'list logs',
        {
          'log-bugtracker': {
            bugtracker: issueTracker,
            tenant: issueTrackerTenant
          }
        }
      ]
    }), {})

export async function getSampleConfig() {
  head(import.meta, 'git flow')
  const { trunkBranchName } = await stringInput('trunkBranchName', { value: 'flight' })

  const branchTypes = await getBranchTypes()

  const startWorkflowConfig = await getStartWorkflowConfig(trunkBranchName, branchTypes)

  // const { graphGitLogLimit } = await numberInput('graphGitLogLimit', {
  //   value: 40, hint: '(rows)'
  // })

  return {
    // graph_git_log_limit: graphGitLogLimit,
    workflows: startWorkflowConfig
  }
}
