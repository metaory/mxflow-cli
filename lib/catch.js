import Ajv from 'ajv'
import { checkBranchExists, checkDirty } from './git.js'
import { removeConfig } from './config.js'
const ajv = new Ajv({ allowUnionTypes: true })

export async function catchNoGit() {
  try {
    await $`git rev-parse --is-inside-work-tree`
    return true
  } catch (error) {
    info(error)
    L.loading('bypass flag', '--no-catch-git')
    L.error('not inside a git worktree')
  }
}

export async function catchDirtyGit() {
  if (await checkDirty() === true) {
    await $$`git status --short`
    L.error('worktree is dirty\n' +
      'stash your changes before continuing.\n' +
      C.yellow('git stash push'))
  }
  log.pass(CWD, 'directory is clean!')
  log.greyDim(fillFrom('━'))
}

export async function catchOldConfig(config) {
  const [, pkgMinorVersion] = PKG_VERSION.split('.')
  const [, cfgMinorVersion] = (config.version || '').split('.')
  const oldConfig = 'version' in config === false
  const minorVersionMissmatch = cfgMinorVersion &&
    pkgMinorVersion !== cfgMinorVersion

  if (oldConfig || minorVersionMissmatch) {
    await removeConfig()
    log.grey('you may run the cli again\n')
    log.fatal(
      'different version',
      `minor ${PKG_VERSION} (${C.bold.yellow(config.version)})`
    )
  }
}

export async function catchBranchExist(branchName) {
  const branchExists = await checkBranchExists(branchName)
  if (branchExists) {
    // log.fatal('Branch Name Exists!', branchName)
    L.error(`Branch name exists: ${C.bold(branchName)}`)
  }
}

export function catchConfigSchema(config) {
  const reduced = Object.keys(config.workflows || {}).reduce((acc, cur) => {
    acc[cur] = {
      type: 'object',
      required: ['steps', 'description'],
      properties: {
        description: { type: 'string' },
        steps: { type: 'array', items: { type: ['string', 'object'] } }
      }
    }
    return acc
  }, {})

  const schema = {
    type: 'object',
    properties: {
      version: { type: 'string' },
      exit_on_error: { type: 'boolean' },
      sleep: { type: 'integer' },
      workflows: { type: 'object', properties: reduced }
    },
    required: ['version', 'workflows'],
    additionalProperties: false
  }

  ajv.validate(schema, config)

  if (ajv.errors) {
    const [{
      message,
      instancePath,
      params: { additionalProperty = '' }
    }] = ajv.errors
    L.error(`config ${C.dim(instancePath)} ${message} ${C.yellow(additionalProperty)}`)
  }
}
