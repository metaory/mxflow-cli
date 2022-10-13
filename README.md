<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset= "https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/mxflow.png">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/mxflow-2.png">
    <img width="40%" alt="Bar chart with benchmark results" src="https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/mxflow.png">
  </picture>
  <br>
  <a href="#why">Why</a> |
  <a href="#config-order">Config</a> |
  <a href="#installation">Installation</a> |
  <a href="#usage">Usage</a> |
  <a href="#options">Options</a>
</p>

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
<!-- - `autocomplete checkout {pattern}` _prompt checkout the pattern branch_ -->
<!-- - `list logs` _list last n pretty git graph log_ -->

### Config order
- `./.mxflow/config.yml`
- `~/.mxflow/config.yml`

<details>
  <summary>sample-config-file</summary>

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
  <img width="75%" src="https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/2022-09-24-163039_980x1037_scrot.png">
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

![mxflow v0.47.21](https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/gifcast_220925134654.gif)

<!-- ![mxflow v0.47.1](https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/gifcast_220922214148.gif) -->
<!-- ![mxflow v0.47.14](https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/gifcast_220923195037.gif) -->
<!-- ![mxflow v0.47.13](https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/gifcast_220923175552.gif) -->


<!-- ![mxflow v0.42.1-2](https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/gifcast_220920203311.gif) -->

<!-- ![mxflow v0.32.5-0](https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/gifcast_220916124849.gif) -->
<!-- ![mxflow v0.32.3](https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/gifcast_220916123031.gif) -->

<!-- #### [[ formely [npm/hgit](https://www.npmjs.com/package/hgit) ]] -->

:warning: MXFlow is in an early state of release. Breaking changes may be made to APIs/core structures as the tool matures.

***

            ___           ___           ___
           /__/\         /__/|         /  /\
          |  |::\       |  |:|        /  /:/_
          |  |:|:\      |  |:|       /  /:/ /\
        __|__|:|\:\   __|__|:|      /  /:/ /:/
       /__/::::| \:\ /__/::::\____ /__/:/ /:/
       \  \:\~~\__\/    ~\~~\::::/ \  \:\/:/
        \  \:\           |~~|:|~~   \  \::/
         \  \:\          |  |:|      \  \:\
          \  \:\         |  |:|       \  \:\
           \__\/         |__|/         \__\/


<!---->
<!-- ![mxflow v0.30.1-1](https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/gifcast_220914224723.gif) -->
<!-- --- -->
<!-- ![mxflow v0.30.1-1](https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/gifcast_220914223020.gif) -->
<!-- --- -->
<!-- ![mxflow v0.27.2](https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/gifcast_220913235153.gif) -->
