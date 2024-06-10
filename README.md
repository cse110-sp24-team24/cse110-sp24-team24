# Team 24 - Developer Journal

A simple and intuitive developer journal application to keep track of your daily coding activities, thoughts, progress, and meeting notes. This project aims to help developers maintain a log of their work, which can be useful for reflection, accountability, and improvement.

### Features

- Create, edit, and delete journal entries
- Create and add tags to notes for organizational purposes
- Search through title entries
- Filter through tag entries

### Installation

You can find the most recent release of the app for Windows and MacOS at...

## Developer Setup

These instructions are here to help future developers setup the project on their machine.

### Prerequisites

You will need to install [node.js](https://nodejs.org/en) then [clone](https://www.atlassian.com/git/tutorials/setting-up-a-repository/git-clone) the repo. You can now install all required dependencies with:

```
npm install
```

That's it you are now all setup!

### Running

To run the project, simply use:

```
npm start
```

### Testing

To run tests, use:

```
npm test
```

## Built With

- [Electron](https://www.electronjs.org/) - Framework for Desktop
- [Jest](https://jestjs.io/) - Testing Framework
- [Puppeteer](https://pptr.dev/) - Library used to do E2E testing

## Team Members

Meet the awesome team behind this project:

- **Cynthia Delira** - _Project Lead_
- **Ishaan Kale** - _Project Lead_
- **David Choi** - _Project Developer_
- **Eugenie Ren** - _Project Developer_
- **Harsh Gurnani** - _Project Developer_
- **Kiera Navarro** - _Project Developer_
- **Sarvesh Mann** - _Project Developer_
- **Jeffrey Lee** - _Project Developer_
- **Sofia Nguyen** - _Project Developer_
- **Terence Tan** - _Project Developer_

You can learn more about us from our [team page](https://github.com/cse110-sp24-team24/cse110-sp24-team24/blob/main/admin/team.md).

# Sub-Team 2: API and Tagging System

<hr style="border:2px solid gray">

**Members**

- Harsh Gurnani
- Sofia Nguyen
- Terence Tan
- Eugenie Ren

**Purpose:**

Team 2 was responsible for creating the basic API structure with the CRUD operations for notes. These CRUD functions were based on saving to local storage for a long time, adhering to the local first principle. As a group, we were also responsible for creating the tag system which we designed and then tailored to be less complex for both the user and the developer. We went from considering a color dependency to implementing tag creation with limited colors to adhere to the KISS principle. We also added functionalities to filter notes by tag and to allow the user to access a dropdown of previously created tags. Team 2 was also in charge of styling our tags and creating unit tests for tag and note creation. Furthermore, in order to package our project as a web app, we had for adopt a new file storage system made by Team 1, which required us to switch from local storage to electron saving techniques for both notes and tags.
