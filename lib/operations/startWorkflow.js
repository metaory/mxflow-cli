import pupa from 'pupa'
import { listLatestLogs } from '../git.js'
import { promptBranchName, promptBranchType, confirmInput } from '../prompts.js'

// -------------------

export default async({ collectType = false }) => {
  const branchType = collectType
    ? await promptBranchType([...cfg.branch_types])
    : cfg.trunk_branch_name

  const pattern = getPattern(branchType)

  const { branchName, taskId } = await promptBranchName(branchType, pattern)

  const commands = getCommands(branchType)

  await runCommands(commands, { taskId, branchType, branchName })

  await pushToRemote(branchName)

  await listLatestLogs({ limit: Math.ceil(process.stdout.rows / 2) })

  logBugTrackerUrl({ taskId, branchType, branchName })
}

// -------------------

const getPattern = (branchType) => {
  const patternKey = `${branchType}__branch_pattern`
  const pattern = cfg.start_workflow[patternKey]
  if (!pattern) {
    log.fatal('missing', patternKey, REL_CONFIG_PATH)
  }
  return pattern
}

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
  if (data) {
    log.greenBox(
      pupa(cfg.bug_tracker_path, data), { title: 'bug tracker' }
    )
  }
}
