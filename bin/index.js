#!/usr/bin/env node
import {
  stringInput,
  listInput
} from '../lib/prompts.js'

import * as operations from '../lib/operations/index.js'

import { checkIsGitDirectory } from '../lib/git.js'
import { getConfig } from '../lib/config.js'
import header from '../lib/header.js'

$.verbose = argv.verbose ?? false

await header()

const config = await getConfig()
console.table({ config })

const isGitDirectory = await checkIsGitDirectory()
if (isGitDirectory === false) {
  console.error(chalk.red('NOT A GIT REPOSITORY!'))
  process.exit(1)
}

const { operation } = await listInput('operation', [
  { name: 'commit', message: 'new commit', disabled: true },
  { name: 'newWorkflow', message: 'start new workflow', disabled: true },
  { name: 'checkConflict', message: 'check for conflicts' },
  { name: 'PR_toLanding', message: 'create PR', disabled: true }
])

await operations[operation](config)

