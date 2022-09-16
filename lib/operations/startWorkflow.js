import pupa from 'pupa'
import { checkBranchExists, listLatestLogs } from '../git.js'
import { promptBranchName, promptBranchType, confirmInput } from '../prompts.js'

export default async({ collectType = false }) => {
  const branchType = collectType
    ? await promptBranchType([...cfg.branch_types])
    : cfg.trunk_branch_name

  const patternKey = `${branchType}__branch_pattern`
  const pattern = cfg.start_workflow[patternKey]
  if (!pattern) {
    log.fatal('missing', patternKey, CONFIG_PATH)
  }

  const { branchName, taskId } = await promptBranchName(branchType, pattern)

  const branchExists = await checkBranchExists(branchName)
  if (branchExists) {
    log.fatal('Branch Name Exists!', branchName)
  }

  log.yellowBox(branchName, { title: 'branchName' })

  const commands = cfg.start_workflow[branchType]
  if (!commands) {
    log.fatal('no workflow for branchType', branchType, CONFIG_PATH)
  }
  await runCommands(commands, { taskId, branchType, branchName })

  const { pushToRemote } = await confirmInput('pushToRemote')
  if (pushToRemote === true) {
    await runCommands(['git_push_origin'], { branchName })
  }

  await listLatestLogs({ limit: Math.ceil(process.stdout.rows / 2) })

  if (taskId) {
    log.greenBox(
      pupa(cfg.bug_tracker_path, { taskId }), { title: 'bug tracker' }
    )
  }
}
