import Prompt from 'enquirer'
import pupa from 'pupa'
import { catchBranchExist } from '../catch.js'
import clipboard from 'clipboardy'
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

export const toggleInput = (name, { message = `select ${C.bold(name)}`, enabled, disabled, hint, initial }) => enquirer.prompt({
  type: 'toggle',
  initial,
  hint,
  enabled,
  disabled,
  name,
  message
})

export const confirmInput = (name, message = 'Are you sure?', initial = false) => enquirer.prompt({
  type: 'confirm',
  hint: `(${name})`,
  initial,
  name,
  message
})

export const numberInput = (name, {
  message = `enter ${C.bold(name)}`,
  hint = '',
  value = 0,
  min = 1
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
    if (val < min) {
      return `${name} have to be greater than ${min}`
    }
    return true
  }
})

export const stringInput = (name, {
  message = `enter ${C.bold(name)}`,
  value = clipboard.readSync().split('\n')[0],
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
    const message = `${C.blue.bold(name)} - ${cfg.workflows[name].description}`
    return { name, message }
  })
  const { branchType } = await autocompleteInput('branchType', branchTypesFormat)
  return branchType
}

export const promptBranchName = async(branchType) => {
  if ('branch' in argv) {
    const { branch: branchName } = argv
    L.warn('reading branch name from argv')
    L.loading('branch', branchName)
    return { branchName }
  }
  const getPattern = (branchType) => {
    const pattern = cfg.workflows[branchType].pattern
    if (!pattern) {
      // log.fatal('missing', branchType, REL_CONFIG_PATH)
      log.warn('no branch pattern found')
      return ''
    }
    log.info(pattern)
    return pattern
  }
  const branchNamePattern = getPattern(branchType)

  const data = { branchType }

  if (branchNamePattern.includes('taskId')) {
    data.taskId = (await stringInput('taskId')).taskId
  }

  if (branchNamePattern.includes('description')) {
    data.description = (await stringInput('description')).description
  }

  const branchName = pupa(branchNamePattern, data)

  await catchBranchExist(branchName)

  branchName && log.yellowBox(branchName, { title: 'branch name' })

  return { ...data, branchName }
}
