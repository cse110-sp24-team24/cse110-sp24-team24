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

# Sub-Team 2: API and Tagging System

## Members

- Harsh Gurnani
- Sofia Nguyen
- Terence Tan
- Eugenie Ren

## Problem

1. The tagging system from the first sprint, uses commas to seperate them

## Tagging system

1. Create a new function to add tags into a new tag made in index.html.
2. have the tags be displayed in the editor, by showing it right between the content and the date box
3. Store the saved tags into a JSON file, upon clicking the save button
4. You are able to change the color of the tags(if you wish)
5. Dropdown box that stores all previously added tags from other notes
6. The search bar now only filters by the title name, also created anothe dropdown box that filters by a specific tag
7. Home button now resets the filter tag
