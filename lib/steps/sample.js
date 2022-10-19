import { stringInput, multiselectInput } from './prompts.js'

export default async() => {
  const { trunkBranchName } = await stringInput('trunkBranchName', { value: 'flight' })

  const branchTypes = await getBranchTypes()

  const { trunkBasedBranches } = await getTrunkBased(branchTypes, trunkBranchName)

  return {
    workflows: [trunkBranchName, ...branchTypes].reduce((acc, cur) => ({
      ...acc,
      [cur]: {
        description: `${cur} example workflow`,
        args: [
          {
            name: 'taskId',
            type: 'string',
            export: 'taskId'
          },
          {
            name: 'description',
            type: 'string',
            export: 'description'
          },
          {
            name: 'MXF_BUG_TRACKER_NAME',
            type: 'env',
            default: 'jira',
            export: 'bugTrackerName'
          },
          {
            name: 'MXF_BUG_TRACKER_TENANT',
            type: 'env',
            default: 'metaory',
            export: 'bugTrackerTenant'
          }
        ],
        steps: [
          'echo running {workflow}',
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
          'git checkout -b ' + (cur === trunkBranchName
            ? cur + '/{description}'
            : cur + '/{taskId}-{description}'),
          'git status',
          'confirm git push --set-upstream origin ' + (cur === trunkBranchName
            ? cur + '/{description}'
            : cur + '/{taskId}-{description}'),
          {
            'list-logs': { limit: 100 }
          },
          {
            'log-bugtracker': {
              bugtracker: '{bugTrackerName}', tenant: '{bugTrackerTenant}'
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
