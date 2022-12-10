import { numberInput, confirmInput } from './steps/prompts.js'
import SampleConfig from './steps/sample.js'
import findFile from 'simple-find-file-recursively-up'

const sampleBasic = {
  exit_on_error: false,
  workflows: {
    foobar: {
      description: 'example placeholder',
      args: [
        { name: 'foo', type: 'string' },
        { name: 'bar', type: 'string', regex: '^bar+\\w', default: 'bar bdef', export: 'barx' }
      ],
      steps: ['echo hello {current-branch} {foo} world', 'echo goodbye {foo} {barx} cruel world', 'confirm echo {barx} goodbye', 'echo "AWS_PROFILE: {AWS_PROFILE}"']
    }
  }
}

export default class Config {
  #config
  #sampleConfig
  constructor() {
    this.path = findFile('.mxflow/config.yml')
    head(import.meta, this.path)
  }

  init() {
    const isInit = argv.init || argv._.includes('init')
    if (isInit === false && this.path) {
      return this.load()
    }

    return this.collect()
  }

  async load() {
    if (!this.path) return Promise.resolve(false)
    const file = await fs.readFile(this.path, 'utf8')

    $.verbose && log.pass(this.path, 'was loaded!')
    $.verbose && logYaml(file)

    return YAML.parse(file)
  }

  async sample() {
    const { promptSamples } = await confirmInput('promptSamples', 'add sample git-flow?')
    if (promptSamples) {
      return SampleConfig()
    }
    return {}
  }

  get config() {
    return {
      sleep: this.sleep,
      version: PKG_VERSION,
      exit_on_error: false,
      ...sampleBasic,
      ...this.sampleConfig
    }
  }

  async make() {
    const { sleepBetweenCommands } = await numberInput('sleepBetweenCommands', {
      value: 1000, hint: '(milliseconds)', min: 1
    })

    this.sleep = sleepBetweenCommands
    this.sampleConfig = await this.sample()
  }

  async collect() {
    head(import.meta, 'new system')

    log.yellowBox('New System!')

    await sleep(100)

    await this.make()

    await this.write()

    L.loading('config', 'was loaded!')

    return this.config
  }

  getDir(path) {
    const a = path.split('/')
    a.pop()
    return a.join('/')
  }

  async commit(path, data) {
    const dir = this.getDir(path)

    await fs.ensureDir(dir)
    await fs.writeFile(path, data)

    log.greyDim(fillFrom('━'))
    log.pass(path, 'was created!')
  }

  async write() {
    spinner.start(C.yellow('configuring...'))

    await sleep(this.config.sleep)

    const yamlConfig = YAML.stringify(this.config)
    logYaml(yamlConfig)

    spinner.succeed('finished.')

    const { makeSystemCopy } = await confirmInput('makeSystemCopy', 'make a system copy?')
    if (makeSystemCopy) {
      await this.commit(`${os.homedir()}/.mxflow/config.yml`, yamlConfig)
    }

    const { makeLocalCopy } = await confirmInput('makeLocalCopy', 'make a local copy?')
    if (makeLocalCopy) {
      await this.commit('./.mxflow/config.yml', yamlConfig)
    }
  }

  static async backup() {
    await fs.ensureDir('/tmp/mxflow')

    const path = findFile('.mxflow/config.yml')
    const backup = '/tmp/mxflow/config.yml'

    log.yellowDim('keeping a backup in: ')
    log.yellow(backup + '\n')

    return $$([`cp ${path} ${backup}`])
  }

  static async reset() {
    const { resetSystemConfig } = await confirmInput('resetSystemConfig')
    if (resetSystemConfig === false) return

    return Config.remove()
  }

  static async remove() {
    const path = findFile('.mxflow/config.yml')

    log.redDim('removing the config:')
    log.red(path + '\n')

    await this.backup()
    await $$([`rm -rf ${path}`])

    log.pass('Config removed.')
  }
}
