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
    chalk: 'readonly',
    fillLine: 'readonly',
    spinner: 'readonly'
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