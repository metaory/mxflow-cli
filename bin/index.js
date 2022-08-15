#!/usr/bin/env node
import 'zx/globals'

import { listInput } from '../lib/prompts.js'
import * as operations from '../lib/operations/index.js'
import { getConfig } from '../lib/config.js'
import { catchNoGit } from '../lib/git.js'
import header from '../lib/header.js'
import '../lib/helper.js'

// console.clear``
//
process.on('uncaughtException', (err) => console.error('', err))
red('HELLOOO!')

$.verbose = argv.verbose ?? false

await header()

const config = await getConfig()

await catchNoGit()

const { operation } = await listInput('operation', operations.list)

await operations[operation](config)
