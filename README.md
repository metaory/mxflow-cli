# hgit
a git workflow cli tool

<p align="center">
  <img width="75%" src="https://raw.githubusercontent.com/wiki/metaory/hgit-cli/assets/hgit.png">
</p>

---

![hgit 0.19.1](https://raw.githubusercontent.com/wiki/metaory/hgit-cli/assets/gifcast_220902160438.gif)
<!-- ![hgit 0.17.0](https://raw.githubusercontent.com/wiki/metaory/hgit-cli/assets/gifcast_220828185239.gif) -->

Goal
====
- Streamline and Simplify complex git processes

Features
========
- check for conflict between multiple remote branch
- start new workflow with `__pre` and `__post` commands are read from config file
- \*all git commands are read from the config file `~/.config/hgit/config.json`
- dynamic branch checkout in workflows with command: `git_pick_{pattern}`
- branchNamePattern from config

---

npx
===
    npx hgit

Installation
============
    npm i -g hgit

Usage
=====
    hgit

Options
=======
    --verbose               | verbose logs

