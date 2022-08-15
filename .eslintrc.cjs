module.exports = {
  env: {
    es2021: true,
    node: true
  },
  globals: {
    $: 'readonly',
    argv: 'readonly',
    log: 'readonly',
    fs: 'readonly',
    os: 'readonly',
    cd: 'readonly',
    chalk: 'readonly'
  },
  extends: 'standard',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
  }
}
