import pupa from 'pupa'
import { listLatestLogs } from '../git.js'
import { promptBranchName, promptBranchType, confirmInput } from '../prompts.js'

// -------------------

export default async({ collectType = false }) => {
  const branchTypes = getBranchTypes()

  const branchType = collectType
    ? await promptBranchType([...branchTypes])
    : cfg.trunk_branch_name

  const { branchName, taskId } = await promptBranchName(branchType)

  const commands = getCommands(branchType)

  await runCommands(commands, { taskId, branchType, branchName })

  await pushToRemote(branchName)

  await listLatestLogs({ limit: Math.ceil(process.stdout.rows / 2) })

  logBugTrackerUrl({ taskId, branchType, branchName })
}

// -------------------

const getBranchTypes = () => Object.keys(cfg.start_workflow).reduce((acc, cur) => {
  if (!cur.includes('__') && cur !== cfg.trunk_branch_name) {
    acc.push(cur)
  }
  return acc
}, [])

const getCommands = (branchType) => {
  const commands = cfg.start_workflow[branchType]
  if (!commands) {
    log.fatal('no workflow for branchType', branchType, REL_CONFIG_PATH)
  }
  return commands
}

async function pushToRemote(branchName) {
  const { pushToRemote } = await confirmInput('pushToRemote')
  if (pushToRemote === true) {
    await runCommands(['git_push_origin'], { branchName })
  }
}

function logBugTrackerUrl(data) {
  if (data && data.taskId) {
    log.greenBox(
      pupa(cfg.bug_tracker_path, data), { title: 'bug tracker' }
    )
  }
}
