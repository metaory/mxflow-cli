import Prompt from 'enquirer'
import pupa from 'pupa'
import { catchBranchExist } from './catch.js'
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

export const autocompleteInput = (name, choices, message = `select ${C.bold(name)}`, initial = '') => enquirer.prompt({
  type: 'autocomplete',
  name,
  limit: 10,
  initial,
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
  spaceReplacer = '-'
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
  const branchTypesFormat = branchTypes.map(name => { // ● ⊙
    const message = C.bold.blue(name)
    return { name, message }
  })
  const { branchType } = await autocompleteInput('branchType', branchTypesFormat)
  return branchType
}

export const promptBranchName = async(branchType) => {
  const getPattern = (branchType) => {
    const patternKey = `${branchType}__branch_pattern`
    const pattern = cfg.workflows[patternKey]
    if (!pattern) {
      log.fatal('missing', patternKey, REL_CONFIG_PATH)
    }
    return pattern
  }
  const branchNamePattern = getPattern(branchType)

  const data = { branchType }

  log.info(branchNamePattern)

  if (branchNamePattern.includes('taskId')) {
    data.taskId = (await stringInput('taskId')).taskId
  }

  if (branchNamePattern.includes('description')) {
    data.description = (await stringInput('description')).description
  }

  const branchName = pupa(branchNamePattern, data)

  await catchBranchExist(branchName)

  log.yellowBox(branchName, { title: 'branchName' })

  return { ...data, branchName }
}
