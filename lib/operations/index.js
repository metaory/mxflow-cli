import checkConflict from './checkConflict.js'
import startWorkflow from './startWorkflow.js'

const list = [
  { name: 'cherryPick', message: 'visual cherry pick', disabled: true },
  { name: 'startWorkflow', message: 'start new workflow' },
  { name: 'checkConflict', message: 'check for conflicts' },
  { name: 'PR_toLanding', message: 'create pull request', disabled: true },
  { name: 'install_husky_hook', message: 'install husky hook', disabled: true }
]

export { checkConflict, startWorkflow, list }
