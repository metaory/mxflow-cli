#!/usr/bin/env node
import '../lib/globals.js'
import '../lib/header.js'

import { autocompleteInput } from '../lib/steps/prompts.js'
import * as operations from '../lib/operations/index.js'
import { getConfig, logSleepBetweenConfig } from '../lib/config.js'
import { catchNoGit, catchDirtyGit } from '../lib/catch.js'
import updateNotifier from 'update-notifier'

updateNotifier({
  pkg: { name: PKG_NAME, version: PKG_VERSION },
  updateCheckInterval: 0
}).notify({ isGlobal: true })

process.env.HUSKY = 0
process.on('uncaughtException', $.verbose ? console.error : () => { })
process.on('unhandledRejection', $.verbose ? console.error : () => { })
process.on('SIGINT', process.exit)

global.cfg = await getConfig()

await catchNoGit()

await catchDirtyGit()

const { operation } = await autocompleteInput('operation', operations.list)
const { options } = operations.list().find(x => x.name === operation)

logSleepBetweenConfig()

await operations[operation](options)
