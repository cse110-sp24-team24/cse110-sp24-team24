# ADR - Local First Structure

## Context and Problem Statement

One of the few design requirements that we had been given for our project by the professor was local first. This requirement brings up a few problems primarily:

1. The app needs to run independent of a network connection.
2. Data be stored and stay persistent across sessions.

So we needed to answer:
What technologies and structure will we use to enable development of a local first application?

## Considered Options

To address problem 1 we needed to find some way of creating an app that will run independently from a network connection. Our options are:

**Electron.JS**
Electron is a framework built on chromium and node allowing developers to make desktop apps using Javascript, HTML, and CSS. It allows us to access node modules and many web apis. The downside is that Electron is very large and will likely increases the size of our app with many functions we may not need.

**Native Desktop Development**
Both Windows and MacOS have ways to develop software natively. The downside of these methods is that there is a steep learning curve to these options that are not taught in class.

---

Spoilers we chose to go with Electron.JS (which we will expand on later). To address problem 2 we need to find some way of storing the users data.

**Local Storage**
This is a convenient way to store data through the window api. However, this data is not guaranteed to persist and may be cleared if caches are cleared or if chrome is updated.

**File Storage**
Through node's file system module we can save app data in the user's file system. This allows us to have persistent data. The con is there are security concerns with accessing a user's file system.

---

Finally we needed to decide on a structure for our app.

**index.html, scripts.js, styles.css**
This is a very simple system that most of us were familiar with. It's a very common structure for simple websites. The downside is that this leads to much of the code being tightly coupled. This also would lead to problems using node.js modules with electron

**index.html, main.js, preload.js, render.js styles.css**
This is the file structure encouraged by electron. main.js is the entry point of the app, responsible for launching browser windows and the like. preload.js is a special file with access to node.js modules. render.js has deals with all the UI logic of the web page.

## Decision Outcome

**Electron.js**

An obvious choice. Much of our team has more experience in Javascript and class resources focus on Javascript. The documentation and support for the Electron framework can be found [here](https://www.electronjs.org/docs/latest/).

**File Storage**

Since the purpose of our app is to be a journal we want to make sure that journal entries are not unexpectedly deleted. Towards this end we have opted to use the node fs module to access the users local file storage to store our data. Docs for the fs module can be found [here](https://nodejs.org/api/fs.html)

**index.html, main.js, preload.js, render.js styles.css**

We have chosen to organize our files in this way to avoid tight coupling. Furthermore, it allows us to more easily integrate our app with Electron.js
