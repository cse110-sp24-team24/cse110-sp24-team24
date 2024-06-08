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

**Members**

- Harsh Gurnani
- Sofia Nguyen
- Terence Tan
- Eugenie Ren

**Purpose**:

Team 2 was responsible for the API structure and implementing the tagging system. During the first week, we were tasked developing a simple CRUD for the developer Journal. We have created a new system that now stores the tags as an array for each saved notes. Also 
 a dropdown boxallowing the user to choose a color to coordinate with their tag. We also rewrote the filtering of the notes to have the search bar be primarily for the note's title, while searching by tags will be with a dropdown box. Unit testing, we had to rewrite over the original Unit test which team 3 had develope inorder to test the new and improve tagging system that is now stored as an array.

# Sub-Team 3 - UI structure and functionality, text processing and styling, unit testing.

<hr style="border:2px solid gray">

**Members**

- Ishaan Kale
- Cynthia Delira
- Jeffrey Lee
- Sarvesh Mann

**Purpose**:

Team 3 was responsible for implementing the structure, styling, and basic functionality of our application as well as unit testing. As a group we added our main html, css, and js files. We added the features to process and style text which includes underline, italic, and bold features. We were also given the task to add codeblocks feature. In order to do that, we examined the pros and cons of having a toolbar with or without any dependency. We chose to add this feature without any dependency adhering to the local first principle. Furthermore, we added unit tests to test the functionality of our script. Finally, we adopted the changes that were made by Team 1 and fixed things accordingly.
