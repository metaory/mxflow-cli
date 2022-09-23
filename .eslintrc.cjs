module.exports = {
  env: {
    es2021: true,
    node: true
  },
  globals: {
    $: 'readonly',
    $$: 'readonly',
    cfg: 'readonly',
    argv: 'readonly',
    log: 'readonly',
    fs: 'readonly',
    os: 'readonly',
    cd: 'readonly',
    info: 'readonly',
    head: 'readonly',
    icons: 'readonly',
    C: 'readonly',
    L: 'readonly',
    logYaml: 'readonly',
    chalk: 'readonly',
    sleep: 'readonly',
    spinner: 'readonly',
    fillFrom: 'readonly',
    fillTo: 'readonly',
    getModuleName: 'readonly',
    CWD: 'readonly',
    YAML: 'readonly',
    PKG_PATH: 'readonly',
    PKG_NAME: 'readonly',
    runCommands: 'readonly',
    PKG_VERSION: 'readonly',
    CONFIG_DIR: 'readonly',
    CONFIG_PATH: 'readonly',
    LOCAL_CONFIG_PATH: 'readonly',
    REL_CONFIG_PATH: 'readonly'
  },
  extends: 'standard',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // 'space-before-function-parentheses': 'never'
    'space-before-function-paren': ['error', 'never'],
    camelcase: ['error', { properties: 'never', ignoreDestructuring: true }]
  }
}
