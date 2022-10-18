<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset= "https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/mxflow-d.png">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/mxflow-l.png">
    <img width="40%" alt="mxflow" src="https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/mxflow-d.png">
  </picture>
  <br>
  <a href="#why">Why</a> |
  <a href="#config">Config</a> |
  <a href="#installation">Installation</a> |
  <a href="#usage">Usage</a> |
  <a href="#options">Options</a>
</p>


<div align="center">
  <a href="https://npmjs.org/package/mxflow">
    <img src="https://img.shields.io/github/package-json/v/metaory/mxflow-cli" alt="NPM Version"/>
  </a>
  <a href="https://npmjs.org/package/mxflow">
    <img src="https://img.shields.io/npm/dw/mxflow" alt="NPM Downloads"/>
  </a>
  <a href="https://github.com/metaory/mxflow-cli/actions/workflows/main.yml">
    <img src="https://img.shields.io/github/workflow/status/metaory/mxflow-cli/MXFlow%20npm%20Package" alt="GH Status"/>
  </a>
</div>


### :zap: A Friendly, General purpose CLI task runner defined by a simple YAML file

<p align="center">
  <img width="75%" src="https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/screenshot.png">
</p>

`mxflow` is a CLI task runner which is defined by a YAML config file. It searches for a `.mxflow/config.yml` in the current directory and parent directories recursively up which it then parses for commands and arguments

## Why?

- Internal processes can get complicated or too repetitive.

- It's hard to streamline complex workflows across teams.

- Existing task-runners are too focused on a specific use case / environment or have complicated config files or are just not friendly.

---
<!-- Group commands under a workflow, write steps, use special commands like `confirm` -->

<!-- The main goal of the mxflow project is to streamline and simplify complex processes -->

## Major features

* **Interactive first** - works with/without arguments; prompt missing args
* **Extensive config** - group commands under a workflows, use arguments export value in commands
* **Shell completion** - dynamic shell completion based on the closest config file
* **Confirmation step** - add the `confirm` prefix to any **_step_** to add a confirmation prompt
* **Project / System config** - searches for a `.mxflow/config.yml` in the current directory and parent directories recursively up

<!-- ## a CICD for internal processes and workflows on local machines for teams -->

<!-- --- -->
<!-- ##### :boom: Unopinionated config based workflow **engine** -->
<!-- ##### :poop: Human readable yaml config -->
<!-- ##### :card_file_box: Streamline complex workflows across teams -->
<!-- ##### :bulb: Simplify complex commands -->

---

### Config
`.mxflow/config.yml`

> `mxflow trigger foobar --foo fval --bar 222`

```yaml
version: 0.60.0
workflows:
  foobar:
    description: example placeholder
    args:
      - name: foo
        type: string
        default: fdef
        export: foox
      - name: bar
        type: number
        default: 123
        export: barx
      - name: MXF_BUG_TRACKER_NAME
        type: env
        default: jira
        export: bugTrackerName
    steps:
      - echo {foox} world
      - echo goodbye {barx} cruel world
      - confirm echo {bugTrackerName} goodbye
  ```

---

<!-- ### Special command prefix -->
<!-- - `confirm {command}` _adds a confirmation step to any commands_ -->

#### Sample use case: [git-workflow](https://github.com/metaory/mxflow-cli/wiki/Git-Workflow-Sample)

---

Arg Types
---------
- string - text input
- number - integer input
- env - environment variable

Requirements
============
- Node 16.x

---

Installation
============
    npm i -g mxflow
    mxflow --setup-completion

or

    npx mxflow
    npx mxflow --setup-completion

Usage
=====
```bash
mxflow <action> [<args>]
```

Options
=======
```bash
init                    | init sample configuration
trigger <workflow-name> | non-interactive workflow trigger
version                 | show version
help                    | help menu
--verbose               | verbose logs
--no-catch-git          | bypass initial git checks
--setup-completion      | setup tab completion, your shell
--clean-completion      | cleanup tab completion
```

Example
=======
```bash
mxflow # or mxf
mxflow trigger foobar --verbose
mxflow trigger feature --taskId xorg --description zelda
mxflow --no-catch-git # to bypass initial git checks
```

---

Roadmap
=======

- [X] project based config file
- [ ] plugin system for dynamic lists
- [X] aurgument mode
- [X] argument autocomplete

---

![mxflow v0.47.21](https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/gifcast.gif)

:warning: MXFlow is in an early state of release. Breaking changes may be made to APIs/core structures as the tool matures.
