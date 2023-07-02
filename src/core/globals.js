import "zx/globals";
import ora from "ora";
import * as L from "prettycli";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as dotenv from "dotenv";
import CT from "chalk-template";
import { catchConfigSchema, catchOldConfig } from "../lib/catch.js";
import Config from "../lib/config.js";

dotenv.config();
$.verbose = argv.verbose ?? argv.v ?? false;
// $.prefix = 'set -euo pipefail;'

const spinner = ora();

const replaceHome = (str = process.cwd()) => str.replace(os.homedir(), "~");

global.ICON = {
  PASS: "✔",
  FAIL: "✖",
  INFO: "ℹ",
  WARN: "⚠",
  VERT: "┃ ",
  HORZ: "╸",
  EDIT: "",
  VIEW: "",
  EXIT: "",
  WORKTREE: "⇄", // 𑂻
  WORKFLOW: "🗲", // ●
  CHECKOUT: "◀",
  CONFLICT: "▲",
};
global.spinner = spinner;
global.C = chalk;
global.L = L;
global.PKG_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../package.json"
);

const { name, version } = await fs.readJson(PKG_PATH);

global.PKG_NAME = name;
global.PKG_VERSION = version;
global.CWD = replaceHome();

if (argv.version || argv._.includes("version")) {
  process.stdout.write(`${PKG_VERSION}\n`);
  process.exit();
}

let _config;
Object.defineProperty(global, "cfg", {
  get: () => _config,
  set: (val) => {
    val.sleep = Number(
      process.env.MXF_SLEEP ?? argv.sleep ?? val.sleep ?? 1000
    );
    L.warn(CT`sleep {yellow.dim is set to} {bold ${val.sleep}ms}`);
    catchConfigSchema(val);
    catchOldConfig(val);
    // info(JSON.stringify(val, null, 2), C.yellow(val.version));
    _config = val;
  },
  configurable: true,
});
global.cfg = await new Config().init();
