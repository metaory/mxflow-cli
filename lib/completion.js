import findFile from 'simple-find-file-recursively-up'
import omelette from 'omelette'

const completion = omelette('mxflow|mxf').tree({
  '--trigger': () => {
    const configPath = findFile('.mxflow/config.yml')
    if (configPath) {
      const file = fs.readFileSync(configPath, 'utf8')
      return Object.keys(YAML.parse(file).workflows)
    } else {
      return ['NO_CONFIG_FOUND']
    }
  },
  '--checkout': ['NOT_IMPLEMENTED', 'placeholder'],
  '--branch': true,
  '--no-catch-git': true,
  '--verbose': true
  // where: {
  //   are: { you: ['from'], the: ['houses', 'cars'] },
  //   is: { your: ['house', 'car'] }
  // }
})
completion.init()

if (argv['setup-completion']) {
  L.warn('setting up shell completion')
  completion.setupShellInitFile()
}

if (argv['clean-completion']) {
  L.warn('cleaning up up shell completion')
  completion.cleanupShellInitFile()
}
