import { stringInput, numberInput, toggleInput, multiselectInput } from './prompts.js'

export default async() => {
  const { trunkBranchName } = await stringInput('trunkBranchName', { value: 'flight' })

  const branchTypes = await getBranchTypes()

  const { trunkBasedBranches } = await getTrunkBased(branchTypes, trunkBranchName)

  const { issueTracker, issueTrackerTenant } = await getIssueTracker()

  return {
    workflows: [trunkBranchName, ...branchTypes].reduce((acc, cur) => ({
      ...acc,
      [cur]: {
        description: `${cur} example workflow`,
        steps: [
          'git fetch origin',
          'git checkout master',
          'git merge origin/master',
          {
            'checkout-branch': {
              base: trunkBasedBranches.includes(cur)
                ? trunkBranchName
                : 'master'
            }
          },
          {
            'create-branch': {
              pattern: cur === trunkBranchName
                ? '{branchType}/{description}'
                : '{branchType}/{taskId}-{description}'
            }
          },
          'git status',
          'confirm git push --set-upstream origin {branchName}',
          {
            'list-logs': { limit: 100 }
          },
          {
            'log-bugtracker': {
              bugtracker: issueTracker, tenant: issueTrackerTenant
            }
          }
        ]
      }
    }), {})
  }
}

async function getBranchTypes() {
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

const getTrunkBased = (branchTypes, trunkBranchName) => multiselectInput(
  'trunkBasedBranches',
  [...branchTypes],
  `select ${C.bold('child branches')} for ${C.bold(trunkBranchName)}`,
  branchTypes.length > 3 ? [0, 1, 2] : 0
)

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
