#!/usr/bin/env node
import 'zx/globals'
import '../lib/helper.js'
import '../lib/header.js'

import { autocompleteInput } from '../lib/prompts.js'
import * as operations from '../lib/operations/index.js'
import { getConfig } from '../lib/config.js'
import { catchNoGit, catchDirtyGit } from '../lib/catch.js'

process.on('uncaughtException', () => {})
process.on('unhandledRejection', () => {})

$.verbose = argv.verbose ?? false

global.cfg = await getConfig()

await catchNoGit()

await catchDirtyGit()

const { operation } = await autocompleteInput('operation', operations.list)

await operations[operation]()
