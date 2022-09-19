import conflictDetection from './conflictDetection.js'
import startWorkflow from './startWorkflow.js'
import checkoutBranch from './checkoutBranch.js'
import cherryPick from './cherryPick.js'
import worktree from './worktree.js'
import { resetConfig } from '../config.js'
import { listLatestLogs } from '../git.js'

const list = () => [
  {
    name: 'conflictDetection',
    message: C.bold.cyan('▲ conflict detection')
  },
  {
    name: 'startTicket',
    message: C.bold.magenta('◼ start new ticket workflow'),
    options: { collectType: true }
  },
  {
    name: 'startTrunk',
    message: C.bold.blue(`● start new ${cfg.trunk_branch_name} workflow`),
    options: { collectType: false }
  },
  {
    name: 'checkoutBranch',
    message: C.bold.yellow('◀ checkout branch')
  },
  {
    name: 'cherryPick',
    disabled: true,
    message: C.bold.yellow('◈ cherry pick')
  },
  {
    name: 'worktree',
    message: C.bold.green('⇄ worktree') // ⭓
  },
  {
    name: 'listLatestLogs',
    message: C.bold.green('∿ graph git logs'), // ⤦ ⧕ ∿
    options: cfg.graph_git_log_limit
  },
  {
    name: 'resetConfig',
    message: C.bold.red('✖ reset config file')
  }
  // { name: 'cherryPick', message: 'interactive cherry pick', disabled: true },
  // { name: 'PR_toLanding', message: 'create pull request', disabled: true },
  // { name: 'install_husky_hook', message: 'install husky hook', disabled: true }
]

export {
  conflictDetection,
  startWorkflow as startTicket,
  startWorkflow as startTrunk,
  listLatestLogs,
  checkoutBranch,
  cherryPick,
  worktree,
  list,
  resetConfig
}
