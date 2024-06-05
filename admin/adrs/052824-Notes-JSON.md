# ADR - Structure of JSON Notes

## Context and Problem Statement

Notes are the most essential component of our journal. We need to determine what the structure of each JSON Note will look like, what attributes they should contain, and how notes will be stored.

## Considered Options

**String Array**:

We considered parsing all the notes into a single string array whose indices contain the data of each note. Every note will contain attributes such as note content, date, tags, and title, and notes are uniquely identified by their index within the array. This will be stored in localStorage.

```
[
{content: "Journal 1", date: "...", tags: "...", title: "..."},
{content: "Journal 2", date: "...", tags: "...", title: "..."},
...
]
```

This was our starting point during Sprint 1 to create the essential CRUD functionality of our journal.

## Decision Outcome

**Array of JSON Objects**

Notes will be stored as a single array of JSON objects whose entries contain the data of each note. Each note will contain the same key/value pairs above ^ as well as an ID key to uniquely identify each note. The JSON object will be stored in a single file on the user's local device via Electron.

```
[
 {
    id: "",
    content: "Journal 1",
    date: "...",
    tags: "...",
    title: "..."
 },
 {
    id: "",
    content: "Journal 2",
    date: "...",
    tags: "...",
    title: "..."
 },
 ...
]
```

_NOTE_: Our previous approach uses the index of an array to identify each note. However, this approach can led to bugs since indices are constantly changing as we create/delete notes.

High level example: Create 4 notes &rarr; edit note 3 and don't save &rarr; delete note 3 from home &rarr; save note 3 &rarr; note 4 will be deleted instead of note 3
