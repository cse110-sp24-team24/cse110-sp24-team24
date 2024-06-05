# Team 24

<hr style="border:2px solid gray">

[Team Page Link](https://github.com/cse110-sp24-team24/cse110-sp24-team24/blob/main/admin/team.md)

# Sub-Team 1 - Electron file storage

<hr style="border:2px solid gray">

**Members**

- David Choi
- Geena Limfat
- Kiera Navarro

**Purpose**:

Team 1 was responsible for implementing the ElectronJS file storage. ElectronJS leverages the user's local files to keep the desktop application running even without an internet connection. As a group, we completed the initial Electron set up. We switched all the code from using local storage to use file storage. In order for file storage to access node modules, we refactored the entire code in `script.js` into a separate API in `preload.mjs`, `fileStorage.js`, and `render.js`. We also created unit testing for our changes and for running Electron.
