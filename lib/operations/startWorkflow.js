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
    log.fatal(CONFIG_PATH, `missing ${patternKey}`)
  }

  const { branchName, taskId } = await promptBranchName(branchType, pattern)

  const branchExists = await checkBranchExists(branchName)
  if (branchExists) {
    log.fatal('Branch Name Exists!', branchName)
  }

  log.yellowBox(branchName, { title: 'branchName' })

  if (!cfg.start_workflow[branchType]) {
    log.fatal(
      CONFIG_PATH,
      `cant find the workflow for branchType ${chalk.bold(branchType)}`
    )
  }
  await runCommands(cfg.start_workflow[branchType], { branchName })

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
