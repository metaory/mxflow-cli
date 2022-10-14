import findFile from 'simple-find-file-recursively-up'
import omelette from 'omelette'
const MXF_MAX_ARGS = process.env.MXF_MAX_ARGS ?? 10

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
const args = (workflow) => (YAML.parse(getConfig())
  .workflows[workflow] ?? { args: [] })
  .args
  .filter(x => x.type === 'string')
  .map(x => '--' + x.name)

const completion = omelette('mxflow|mxf <action> <workflow> ' +
  '<arg> <val> '.repeat(MXF_MAX_ARGS))

completion.on('action', ({ reply }) => {
  reply(['trigger', 'init', 'version', 'reset', 'help', '--verbose'])
})
completion.on('flags', ({ reply }) => {
  reply(['--verbose'])
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

// omelette`mxflow ${['trigger']} ${workflows()} ${args()} ${args()}`.init()

// const completion = omelette('mxflow|mxf').tree({
//   'trigger': () => {
//     // '--trigger': () => {
//   },
//   // },
//   '--checkout': ['NOT_IMPLEMENTED', 'placeholder'],
//   // '--branch': true,
//   // '--no-catch-git': true,
//   // '--verbose': true
//   // where: {
//   //   are: {you: ['from'], the: ['houses', 'cars'] },
//   //   is: {your: ['house', 'car'] }
//   // }
// })
// completion.init()

if (argv['setup-completion']) {
  L.warn('setting up shell completion')
  completion.setupShellInitFile()
}

if (argv['clean-completion']) {
  L.warn('cleaning up up shell completion')
  completion.cleanupShellInitFile()
}
