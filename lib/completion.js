import findFile from 'simple-find-file-recursively-up'
import omelette from 'omelette'

const workflows = () => {
  const configPath = findFile('.mxflow/config.yml')
  if (configPath) {
    const file = fs.readFileSync(configPath, 'utf8')
    return Object.keys(YAML.parse(file).workflows)
  } else {
    return ['NO_CONFIG_FOUND']
  }
}
const args = () => {
  const configPath = findFile('.mxflow/config.yml')
  const file = fs.readFileSync(configPath, 'utf8')
  return YAML.parse(file).workflows.feature.args.map(x => '--' + x.name)
}

const completion = omelette(`mxflow|mxf <action> <workflow> <arg> <val> <arg> <val> <arg>`);

completion.on('action', ({ reply }) => {
  reply(['trigger'])
})

completion.on('workflow', ({ reply }) => {
  reply(workflows())
})

completion.on('arg', ({ before, reply, line }) => {
  reply(args())
})

completion.on('val', ({ before, reply }) => {
  reply(args())
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
//   //   are: { you: ['from'], the: ['houses', 'cars'] },
//   //   is: { your: ['house', 'car'] }
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
