import { fileURLToPath } from "node:url";
import boxen from "boxen";
import { highlight } from "cli-highlight";
const {
  stdout: { columns },
} = process;

const replaceHome = (str = process.cwd()) => str.replace(os.homedir(), "~");

const getModuleName = (url) => {
  const [[moduleName]] = fileURLToPath(url)
    .split("/")
    .map((x) => x.split("."))
    .reverse();
  return moduleName;
};

global.head = ({ url }, etc = "-") =>
  L.info(
    getModuleName(url),
    `module loaded  ⌜${C.yellow(replaceHome(String(etc)))}⌝`
  ); // ⌞⌟ ⌜⌝

global.info = (msg, etc) => $.verbose && console.info(msg, etc);

global.fillFrom = (char = "x", length = columns) =>
  Array.from({ length })
    .map(() => char)
    .join("");

global.fillTo = (str) =>
  Array.from(str)
    .map(() => global.ICON.HORZ)
    .join("");

global.newLine = () => process.stdout.write("\n");

global.logYaml = (str, ignoreIllegals = true) => {
  const theme = { string: C.blue, attr: C.cyan.bold };
  const language = "yaml";
  global.newLine();
  process.stdout.write(highlight(str, { theme, language, ignoreIllegals }));
  global.newLine();
};

const _log = (txt, color, mode = "reset") =>
  process.stdout.write(C[mode][color](txt) + "\n");
const _box = (txt, color, opt = {}) => _log(boxen(txt, opt), color);
const _upp = (str) => str.charAt(0).toUpperCase() + str.substr(1, str.length);
global.log = [
  "red",
  "green",
  "yellow",
  "blue",
  "magenta",
  "cyan",
  "grey",
].reduce(
  (acc, cur) => {
    acc[cur] = (txt) => _log(txt, cur);
    acc[`${cur}Sat`] = (txt) => _log(txt, `${cur}Bright`);
    acc[`${cur}Dim`] = (txt) => _log(txt, cur, "dim");
    acc[`bg${_upp(cur)}`] = (txt) => _log(C.black.bold(txt), `bg${_upp(cur)}`);
    acc[`${cur}Box`] = (
      txt,
      {
        title,
        padding = 1,
        borderStyle = cur === "red" ? "double" : "bold",
      } = {}
    ) => _box(txt, cur, { title, padding, borderStyle });

    return acc;
  },
  {
    pass: (txt, etc = "") =>
      _log(`${global.ICON.PASS} ${C.blue(replaceHome(txt))} ${etc}`, "green"),
    info: (txt, etc = "") =>
      _log(`${global.ICON.INFO} ${C.magenta(txt)} ${etc}`, "cyan"),
    warn: (txt, etc = "") =>
      _log(`${global.ICON.WARN} ${C.yellowBright(txt)} ${etc}`, "yellow"),
    fail: (txt, etc = "") =>
      _log(`${global.ICON.FAIL} ${C.redBright(txt)} ${etc}`, "red"),
    fatal: (txt, etc = "", title = CWD) => {
      const icon = C.redBright(global.ICON.FAIL);
      log.redBox(`${icon} ${txt} ${C.redBright(etc)}`, { title });
      process.exit(1);
    },
  }
);
