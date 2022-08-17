import checkConflict from './conflict.js'
import newWorkflow from './newWorkflow.js'

const list = [
  { name: 'commit', message: 'new commit', disabled: true },
  { name: 'checkConflict', message: 'check for conflicts' },
  { name: 'newWorkflow', message: 'start new workflow' },
  { name: 'PR_toLanding', message: 'create PR', disabled: true },
  { name: 'install_husky_hook', message: 'install husky hook', disabled: true }
]

export { checkConflict, newWorkflow, list }
