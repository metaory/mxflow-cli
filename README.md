<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/card.png">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/card.png">
    <img width="90%" alt="mxflow" src="https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/card.png">
  </picture>
  <br>
  <a href="#why">Why</a> |
  <a href="#config">Config</a> |
  <a href="#installation">Installation</a> |
  <a href="#usage">Usage</a> |
  <a href="#options">Options</a> |
  <a href="#videos">Videos</a>
</p>


<div align="center">
  <a href="https://npmjs.org/package/mxflow">
    <img src="https://img.shields.io/npm/v/mxflow" alt="NPM Version"/>
  </a>
  <a href="https://npmjs.org/package/mxflow">
    <img src="https://img.shields.io/npm/dm/mxflow" alt="NPM Downloads"/>
  </a>
  <a href="https://github.com/metaory/mxflow-cli/actions/workflows/main.yml">
    <img src="https://img.shields.io/github/workflow/status/metaory/mxflow-cli/MXFlow%20npm%20Package" alt="GH Status"/>
  </a>
  <a href="https://github.com/metaory/mxflow-cli">
    <img src="https://img.shields.io/github/languages/code-size/metaory/mxflow-cli" alt="Code Size"/>
  </a>
</div>


<p align="center">
  :zap: A Friendly, General purpose CLI task runner :rocket:
</p>


<p align="center">
  <img width="75%" src="https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/screenshot.png">
</p>

`mxflow` is a CLI task runner which is configured via a YAML config file.

It searches for a `.mxflow/config.yml` in the current directory and parent directories recursively up which it then parses for commands and arguments

## Why?

- Internal processes can get **complicated** or too **repetitive**.

- It's hard to **streamline** complex workflows across **teams**.

- Existing task-runners are too focused on a specific **use-case/environment** or have **complicated config** files or are just **not friendly**!

---
<!-- Group commands under a workflow, write steps, use special commands like `confirm` -->

<!-- The main goal of the mxflow project is to streamline and simplify complex processes -->

## Major Features

* **Interactive first** - works with/without arguments; prompt missing args
* **Extensive config** - group commands under a workflow, use arguments export value in commands
* **Shell completion** - dynamic shell completion based on the closest config file
* **Confirmation** - add `confirm` prefix to any **_step command_** to add confirmation prompt
* **Project / System config** - searches for a `.mxflow/config.yml` in the current directory and parent directories recursively up

<!-- ## a CICD for internal processes and workflows on local machines for teams -->

<!-- --- -->
<!-- ##### :boom: Unopinionated config based workflow **engine** -->
<!-- ##### :poop: Human readable yaml config -->
<!-- ##### :card_file_box: Streamline complex workflows across teams -->
<!-- ##### :bulb: Simplify complex commands -->

---

Config
======

`.mxflow/config.yml`

> `mxflow trigger foobar --foo fval --bar bar-xorg`

```yaml
version: 0.60.0
workflows:
  foobar:
    description: example placeholder
    args:
      - name: foo
        type: string
      - name: bar
        regex: ^bar+\w
        default: barxorg
        export: barx
    steps:
      - echo {foo} world
      - echo goodbye {foo} {barx} cruel world
      - confirm echo {barx} goodbye
      - echo AWS_PROFILE $AWS_PROFILE
      - echo AWS_PROFILE {AWS_PROFILE}
  ```

---

Config Reference
----------------
`version` - config version

`exit_on_error` - _(optional)_ should exit on any command with a non-zero exit code, default is `false`

`sleep` - _(optional)_ adds a delay between each command, default is `1000`

`workflows` - object with workflows

Workflow Reference
------------------

`description` - workflow description

`args` - list of arguments

`args[*].name` - what user inputs as argument

`args[*].type` - validation type; `string | number`

`args[*].export` - _(optional)_ the exported variable, default is `args[*].name`

`args[*].default` - _(optional)_ the default value, if any

`args[*].regex` - _(optional)_ validation pattern

`steps` - list of commands to run

`steps[*]` - the command to run, any shell command string, few specials commands

> note: you can write a `cd` pre-step to change `cwd` of the following command

> note: you can add a `confirm` prefix to add confirmation prompt

> note: currently there are few special git commands: `checkout-branch, list-logs, log-bugtracker`. check [wiki](https://github.com/metaory/mxflow-cli/wiki/Git-Workflow-Sample) for usage example

Config Variables
----------------
example: `echo foo {variable} bar`

- Argument variables
    - `args` - `export` or `name`
- Environment variables
    - `environment` - system environment variables
    - `.env` - variables defined in the `.env` file
- Special variables
    - `{current-branch}` - current active branch
    - `{workflow}` - current active workflow

---

<!-- ### Special command prefix -->
<!-- - `confirm {command}` _adds a confirmation step to any commands_ -->

#### :globe_with_meridians: Real-world Use case: [git-workflow](https://github.com/metaory/mxflow-cli/wiki/Git-Workflow-Sample)

---

Requirements
============
- Node 16+

---

Installation
============
Install the package, globally:

```bash
sudo npm i -g mxflow
```

Setup shell tab completion:

```bash
mxflow --setup-completion
```

> make sure to run this command **once**, in case you have ran this multiple times, you can run the `mxflow --clean-completion` to clean and run setup again once.

Usage
=====

```bash
mxflow [<action>] [<args>]
```

CLI Options
===========

```markdown
init                    | init sample configuration
trigger <workflow-name> | non-interactive workflow trigger
version                 | show version
help                    | help menu
-v, --verbose           | verbose logs
-F, --force             | bypass confirmation prompts
--no-catch-git          | bypass initial git checks
--setup-completion      | setup shell tab completion
--clean-completion      | cleanup tab completion
```

Examples
========

for a fully interactive experience;

```bash
mxflow # or mxf
```

to interactively select a workflow to trigger;

```bash
mxflow trigger
```

to bypass `git` checks;

```bash
mxflow --no-catch-git
```

to bypass *confirmation* prompts;

```bash
mxflow --force
```

to trigger a particular workflow interactively;

```bash
mxflow trigger create-flight
```

to trigger a particular workflow with arguments;

```bash
mxflow trigger create-flight --taskId my-tsk --description my-desc --force
```

---

Roadmap
=======

- [X] project based config file
- [ ] plugin system for dynamic lists
- [X] aurgument mode
- [X] argument autocomplete
- [X] support `.env` file import

---

Videos
======

### Installation

![gifcast_221027184725.gif](https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/gifcast_221027184725.gif)


### Interactive Usage

![gifcast_221027185051.gif](https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/gifcast_221027185051.gif)

### Argument Usage

![gifcast_221027200734.gif](https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/gifcast_221027200734.gif)

---

:warning: MXflow is in an early state of release. Breaking changes may be made to APIs/core structures as the tool matures.

License
-------

[MIT](LICENSE)
