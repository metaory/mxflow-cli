import findFile from 'simple-find-file-recursively-up'
import omelette from 'omelette'
import fs from 'fs'
import YAML from 'yaml'

const MXF_MAX_ARGS = process.env.MXF_MAX_ARGS ?? 2 // XXX

const getConfig = () => {
  const configPath = findFile('.mxflow/config.yml')
  if (!configPath) { return false }
  return fs.readFileSync(configPath, 'utf8')
}

const workflows = () => {
  const file = getConfig()
  return file
    ? Object.keys(YAML.parse(file).workflows)
    : ['CONFIG_NOT_FOUND']
}
const args = (workflow) => {
  const args = YAML
    .parse(getConfig())
    .workflows[workflow]
    .args ?? []
  return [
    ...args.filter(x => x.type === 'string'),
    { name: 'force' },
    { name: 'verbose' }
  ]
    .map(x => { return '--' + x.name })
}

const completion = omelette('mxflow|mxf <action> <workflow> ' +
  '<arg> <val> '.repeat(MXF_MAX_ARGS) + '<flags> <flags>')

completion.on('action', ({ reply }) => {
  reply(['trigger', 'init', 'version', 'reset', 'help', '--no-catch-git', '--force', '--verbose', '--setup-completion', '--clean-completion'])
})
completion.on('flags', ({ reply, line }) => {
  reply(['--verbose', '--force'].filter(x => !line.includes(x)))
})

completion.on('workflow', ({ before, reply }) => {
  reply(before === 'trigger' ? workflows() : [])
})

completion.on('arg', ({ reply, line }) => {
  const [, , workflow] = line.split(' ')
  reply(args(workflow).filter(x => !line.includes(x)))
})

completion.on('val', ({ reply }) => {
  reply([''])
})
completion.init()

switch (process.argv[2]) {
  case '--setup-completion':
    L.warn('setting up shell completion')
    completion.setupShellInitFile()
    break
  case '--clean-completion':
    L.warn('cleaning up up shell completion')
    completion.cleanupShellInitFile()
    break
}
