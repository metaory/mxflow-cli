import boxen from 'boxen'

const _log = (txt, color) => console.log(chalk[color](txt))
const _box = (txt, color, opt = {}) => console.log(chalk[color](boxen(txt, opt)))

for (const color of ['red', 'yellow', 'green', 'blue', 'cyan']) {
  global[color] = (txt) => _log(txt, color)
}

global.log = {
  infoBox: (txt) => _box(txt, 'cyan'),
  info: (...txt) => _log(txt, 'cyan'),

  successBox: (txt) => _box(txt, 'green'),
  success: (...txt) => _log(txt, 'green'),

  errorBox: (txt) => _box(txt, 'red', { padding: 1, borderStyle: 'double' }),
  error: (...txt) => _log(txt, 'red'),

  warnBox: (txt) => _box(txt, 'yellow'),
  warn: (...txt) => _log(txt, 'yellow')
}
