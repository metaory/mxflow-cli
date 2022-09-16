module.exports = {
  env: {
    es2021: true,
    node: true
  },
  globals: {
    $: 'readonly',
    cfg: 'readonly',
    argv: 'readonly',
    log: 'readonly',
    fs: 'readonly',
    os: 'readonly',
    cd: 'readonly',
    info: 'readonly',
    icons: 'readonly',
    C: 'readonly',
    chalk: 'readonly',
    sleep: 'readonly',
    spinner: 'readonly',
    fillLine: 'readonly',
    fillFrom: 'readonly',
    CWD: 'readonly',
    PKG_PATH: 'readonly',
    PKG_NAME: 'readonly',
    runCommands: 'readonly',
    PKG_VERSION: 'readonly',
    CONFIG_DIR: 'readonly',
    CONFIG_PATH: 'readonly',
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
