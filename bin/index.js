#!/usr/bin/env node
console.clear``

import { stringInput, listInput } from '../lib/prompts.js'
import * as operations from '../lib/operations/index.js'
import { getConfig } from '../lib/config.js'
import { catchNoGit } from '../lib/git.js'
import header from '../lib/header.js'

process.on('uncaughtException', () => {/* noop */})

$.verbose = argv.verbose ?? false

await header()

const config = await getConfig()

await catchNoGit()

const { operation } = await listInput('operation', operations.list)

await operations[operation](config)

