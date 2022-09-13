import Prompt from 'enquirer'
import pupa from 'pupa'

const enquirer = new Prompt()

export const multiselectInput = (name, choices, message, initial) => enquirer.prompt({
  type: 'multiselect',
  name,
  limit: 10,
  // hint: '(Use <space> to select, <return> to submit)',
  initial,
  message: message || `select ${name}`,
  choices
})

export const autocompleteInput = (name, choices, message) => enquirer.prompt({
  type: 'autocomplete',
  name,
  limit: 10,
  message: message ?? `select ${name}`,
  choices
})

export const toggleInput = (name, message, { enabled, disabled, hint }) => enquirer.prompt({
  type: 'toggle',
  hint,
  enabled,
  disabled,
  name,
  message
})

export const confirmInput = (name, message = 'Are you sure?') => enquirer.prompt({
  type: 'confirm',
  name,
  message
})

export const numberInput = (name, {
  message,
  hint = '',
  value = 0
} = {}) => enquirer.prompt({
  type: 'input',
  name,
  hint,
  result: (val) => Number(val),
  message: message ?? `enter ${name}`,
  default: value,
  validate: (val) => {
    if (!val) {
      return `${name} cant be empty!`
    }
    if (isNaN(val)) {
      return `${name} have to be number`
    }
    if (val < 0) {
      return `${name} have to be greater than 0`
    }
    return true
  }
})

export const stringInput = (name, {
  message,
  value = '',
  hint,
  spaceReplacer = '_'
} = {}) => enquirer.prompt({
  type: 'input',
  name,
  hint,
  result: (val) => val.trim().replaceAll(' ', spaceReplacer),
  message: message ?? `enter ${name}`,
  default: value,
  validate: (val) => !!val || `${name} cant be empty!`
})

export const listInput = (name, choices, message) => enquirer.prompt({
  type: 'select',
  name,
  message: message ?? `select ${name}`,
  limit: 7,
  choices
})

export const promptBranchType = async (branchTypes) => {
  const { branchType } = await autocompleteInput('branchType', branchTypes)
  return branchType
}

export const promptBranchName = async (branchType, tpl) => {
  const data = { branchType }

  log.info(tpl)

  if (tpl.includes('taskId')) {
    data.taskId = (await stringInput('taskId')).taskId
  }

  if (tpl.includes('description')) {
    data.description = (await stringInput('description')).description
  }

  return pupa(tpl, data)
}
