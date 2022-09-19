import pupa from 'pupa'
import { listLatestLogs } from '../git.js'
import { promptBranchName, promptBranchType } from '../prompts.js'

// -------------------

export default async({ collectType = false }) => {
  head(import.meta, collectType ? 'ticket' : cfg.trunk_branch_name)

  const branchType = await getBranchType(collectType)

  const { branchName, taskId } = await promptBranchName(branchType)

  const commands = getCommands(branchType)

  await runCommands(commands, { taskId, branchType, branchName })

  logBugTrackerUrl({ taskId, branchType, branchName })
}

// -------------------
const getBranchTypes = () => Object.keys(cfg.start_workflow)
  .reduce((acc, cur) => {
    if (!cur.includes('__') && cur !== cfg.trunk_branch_name) {
      acc.push(cur)
    }
    return acc
  }, [])

const getBranchType = async(collect) => collect
  ? promptBranchType([...getBranchTypes()])
  : cfg.trunk_branch_name

const getCommands = (branchType) => {
  const commands = cfg.start_workflow[branchType]
  if (!commands) {
    log.fatal('no workflow for branchType', branchType, REL_CONFIG_PATH)
  }
  return commands
}

function logBugTrackerUrl(data) {
  if (data && data.taskId) {
    log.greenBox(
      pupa(cfg.bug_tracker_path, data), { title: 'bug tracker' }
    )
  }
}
