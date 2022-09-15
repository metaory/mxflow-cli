import Prompt from 'enquirer'
import pupa from 'pupa'

const enquirer = new Prompt()

export const multiselectInput = (name, choices, message = `select ${C.bold(name)}`, initial) => enquirer.prompt({
  type: 'multiselect',
  name,
  limit: 10,
  // hint: '(Use <space> to select, <return> to submit)',
  initial,
  message,
  choices
})

export const autocompleteInput = (name, choices, message = `select ${C.bold(name)}`) => enquirer.prompt({
  type: 'autocomplete',
  name,
  limit: 10,
  message,
  choices
})

export const toggleInput = (name, { message = `select ${C.bold(name)}`, enabled, disabled, hint }) => enquirer.prompt({
  type: 'toggle',
  hint,
  enabled,
  disabled,
  name,
  message
})

export const confirmInput = (name, message = 'Are you sure?') => enquirer.prompt({
  type: 'confirm',
  hint: `(${name})`,
  name,
  message
})

export const numberInput = (name, {
  message = `enter ${C.bold(name)}`,
  hint = '',
  value = 0
} = {}) => enquirer.prompt({
  type: 'input',
  name,
  hint,
  result: (val) => Number(val),
  message,
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
  message = `enter ${C.bold(name)}`,
  value = '',
  hint,
  spaceReplacer = '_'
} = {}) => enquirer.prompt({
  type: 'input',
  name,
  hint,
  result: (val) => val.trim().replaceAll(' ', spaceReplacer),
  message,
  default: value,
  validate: (val) => !!val || `${name} cant be empty!`
})

export const listInput = (name, choices, message = `select ${C.bold(name)}`) => enquirer.prompt({
  type: 'select',
  name,
  message,
  limit: 7,
  choices
})

export const promptBranchType = async(branchTypes) => {
  const { branchType } = await autocompleteInput('branchType', branchTypes)
  return branchType
}

export const promptBranchName = async(branchType, tpl) => {
  const data = { branchType }

  log.info(tpl)

  if (tpl.includes('taskId')) {
    data.taskId = (await stringInput('taskId')).taskId
  }

  if (tpl.includes('description')) {
    data.description = (await stringInput('description')).description
  }

  return {
    ...data,
    branchName: pupa(tpl, data)
  }
}
