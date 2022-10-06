# MXFlow

## a CICD for internal processes and workflows on local machines for teams
group commands under a workflow, write steps, use special commands like `confirm`

---
##### :boom: Unopinionated config based workflow **engine**
##### :card_file_box: Streamline complex workflows across teams
##### :bulb: Simplify complex commands

---

### Special commands
- `confirm {command}` _adds a confirmation step to any commands_
<!-- - `autocomplete checkout {pattern}` _prompt checkout the pattern branch_ -->
<!-- - `list logs` _list last n pretty git graph log_ -->

### Config order
- `./.mxflow/config.yml`
- `~/.mxflow/config.yml`

<details>
  <summary>sample-config-file</summary>

  ```yaml
version: 0.50.0
workflows:
  foobar:
    description: example placeholder
    steps:
      - echo hello word
      - echo goodbye cruel world
      - confirm echo goodbye
  feature:
    description: feature example workflow
    steps:
      - git fetch origin
      - git checkout master
      - git merge origin/master
      - checkout-branch:
          base: flight
      - create-branch:
          pattern: "{branchType}/{taskId}-{description}"
      - git status
      - confirm git push --set-upstream origin {branchName}
      - list logs
      - log-bugtracker:
          bugtracker: jira
          tenant: metaory

  ```
</details>

#### sample usecase: [git-workflow](https://github.com/metaory/mxflow-cli/wiki/Git-Workflow-Use-case)

---

<p align="center">
  <img width="75%" src="https://raw.githubusercontent.com/wiki/metaory/mxflow-cli/assets/2022-09-24-163039_980x1037_scrot.png">
</p>

---

Requirements
============
- Node 16.x

---

Installation
============
    npm i -g mxflow

or

    npx mxflow

Usage
=====
    mxflow # or mxf
    mxflow --trigger foobar
    mxflow --trigger feature --branch feat/xorg
    mxflow --trigger hotfix --branch hotfix/zelda --verbose
    mxflow --no-catch-git # to bypass initial git checks

Options
=======
    --verbose                 | verbose logs
    --trigger <workflow-name> | non-interactive workflow trigger
    --branch <branch-name>    | branch name for non-interactive flow
    --no-catch-git            | bypass initial git checks

---

Roadmap
=======

- [X] project based config file
- [ ] plugin system for dynamic lists
- [X] aurgument mode
- [ ] argument autocomplete

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
