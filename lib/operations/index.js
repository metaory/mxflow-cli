import checkConflict from './checkConflict.js'
import startTicket from './startTicket.js'
import checkoutBranch from './checkoutBranch.js'
import cherryPick from './cherryPick.js'
import { resetConfig } from '../config.js'

const list = () => [
  // { name: 'cherryPick', message: 'interactive cherry pick', disabled: true },
  { name: 'checkConflict', message: chalk.magenta(' check for conflict') },
  { name: 'startTicket', message: chalk.blue(' start new ticket workflow') },
  { name: 'startTrunk', message: chalk.cyan(`ﰩ start new ${cfg.trunk_branch_name} workflow`) },
  { name: 'checkoutBranch', message: chalk.yellow(' checkout Branch') },
  { name: 'resetConfig', message: chalk.red(' reset config file') }
  // { name: 'PR_toLanding', message: 'create pull request', disabled: true },
  // { name: 'install_husky_hook', message: 'install husky hook', disabled: true }
]

export {
  checkConflict,
  startTicket,
  checkoutBranch,
  cherryPick,
  list,
  resetConfig
}
