<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset= "https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/mxflow-d.png">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/mxflow-l.png">
    <img width="40%" alt="mxflow" src="https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/mxflow-d.png">
  </picture>
  <br>
  <a href="#why">Why</a> |
  <a href="#config-order">Config</a> |
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


`mxflow` is a CLI task runner which is defined by a yaml config file. It searches for a `.mxflow/config.yml` in the current directory and parent directories recursively up which it then parses for commands and arguments

## Why?

Internal processes can get complicated or too repetitive

The main goal of the mxflow project is to streamline and simplify complex processes

Major features:

* Interactive first
* Local first
* Extensive config
* Shell completion

## a CICD for internal processes and workflows on local machines for teams
group commands under a workflow, write steps, use special commands like `confirm`

---
##### :boom: Unopinionated config based workflow **engine**
##### :card_file_box: Streamline complex workflows across teams
##### :bulb: Simplify complex commands

---

### Special command prefix
- `confirm {command}` _adds a confirmation step to any commands_

### Config order
- `./.mxflow/config.yml`
- `~/.mxflow/config.yml`

<details>
  <summary><h4>sample-config-file</h4></summary>

  ```yaml
version: 0.60.0
sleep: 1000
workflows:
    feature:
      description: feature example workflow
      args:
        - name: taskId
          type: string
          export: taskId
        - name: description
          type: string
          export: description
        - name: MXF_BUG_TRACKER_NAME
          type: env
          default: jira
          export: bugTrackerName
        - name: MXF_BUG_TRACKER_TENANT
          type: env
          default: metaory
          export: bugTrackerTenant
      steps:
        - git fetch origin
        - git checkout master
        - git merge origin/master
        - checkout-branch:
            base: flight
        - git checkout -b {workflow}/{taskId}-{description}
        - git status
        - confirm git push --set-upstream origin
          {workflow}/{taskId}-{description}
        - list-logs:
            limit: 100
        - log-bugtracker:
            bugtracker: "{bugTrackerName}"
            tenant: "{bugTrackerTenant}"
  ```
</details>

#### sample usecase: [git-workflow](https://github.com/metaory/mxflow-cli/wiki/Git-Workflow-Use-case)

---

<p align="center">
  <img width="75%" src="https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/screenshot.png">
</p>

---

Arg Types
---------
- string
- number
- env

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
mxflow # or mxf
mxflow trigger foobar --verbose
mxflow trigger feature --taskId xorg --description zelda
mxflow --no-catch-git # to bypass initial git checks
```

Options
=======
```bash
init                    | init sample configuration
trigger <workflow-name> | non-interactive workflow trigger
verbose                 | verbose logs
version                 | show version
--help                  | help menu
--no-catch-git          | bypass initial git checks
--setup-completion      | setup tab completion, your shell
--clean-completion      | cleanup tab completion
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
