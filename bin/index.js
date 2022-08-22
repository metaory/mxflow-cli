#!/usr/bin/env node
import 'zx/globals'

import { autocompleteInput } from '../lib/prompts.js'
import * as operations from '../lib/operations/index.js'
import { getConfig } from '../lib/config.js'
import { catchNoGit, catchDirtyGit } from '../lib/catch.js'
import header from '../lib/header.js'
import '../lib/helper.js'

process.on('uncaughtException', (err) => console.error('', err))
process.on('unhandledRejection', (err) => console.error('', err))

$.verbose = argv.verbose ?? false

global.cfg = await getConfig()

await header()

await catchNoGit()

await catchDirtyGit()

const { operation } = await autocompleteInput('operation', operations.list)

await operations[operation]()
