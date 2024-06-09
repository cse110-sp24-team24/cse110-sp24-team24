/* eslint-disable no-undef */

// Note: this is a hack-y way, but the complexity of electron means this
// method is (for now) the most feasible one.
// Set up DOM elements
document.body.innerHTML = `
<!-- Sidebar with navigation buttons -->
    <nav class="sidebar" role="navigation">
      <button id="homeButton" aria-label="Home">🏠 Home</button>
      <button id="addNoteButton" aria-label="Add Note">➕ Add Note</button>
      <input type="checkbox" id="darkmode-toggle" />
    </nav>
    <!-- Main content area -->
    <main class="main-content">
      <!-- Header with the title of the webpage -->
      <header class="header-title">
        <h1>Dev Journal</h1>
        <p>Your Personal Developer Notebook</p>
      </header>
      <!-- Search bar for searching notes -->
      <div class="search-bar">
        <input
          type="text"
          id="searchInput"
          placeholder="Search..."
          aria-label="Search"
        />
        <button id="filterButton" aria-label="Filter">&#9662;</button>
        <div id="filter-dropdown-container" class="hidden">
          <ul id="filter-dropdown-list">
            <!-- Tag options will be dynamically inserted here -->
          </ul>
        </div>
      </div>
      <!-- Container for displaying notes -->
      <section id="notesContainer">
        <h2>Your Journals:</h2>
        <!-- Notes will be dynamically inserted here -->
      </section>
    </main>
    <!-- Note editor section -->
    <section id="noteEditor" class="hidden" aria-hidden="true">
      <!-- Toolbar with options for saving, deleting, or canceling a note -->
      <div class="editor-toolbar">
        <button id="saveNoteButton" aria-label="Save Note">💾 Save</button>
        <button id="deleteNoteButton" aria-label="Delete Note">
          🗑️ Delete
        </button>
        <button id="cancelButton" aria-label="Cancel">❌ Cancel</button>
      </div>
      <!-- Input fields for the note's title, date, content, and tags -->
      <label for="noteTitle">Title</label>
      <input
        type="text"
        id="noteTitle"
        placeholder="Title"
        aria-label="Note Title"
      />
      <div id="date-tags-container">
        <label for="noteDate">Date</label>
        <input type="date" id="noteDate" aria-label="Note Date" />

        <!-- Tag color picker -->
        <form>
        <select required name="tag-color" id="tag-color">
          <option value="" disable selected hidden>Select tag color</option>
          <option value="">Default</option>
          <option value="red">Red</option>
          <option value="orange">Orange</option>
          <option value="yellow">Yellow</option>
          <option value="green">Green</option>
          <option value="blue">Blue</option>
        </select>
        </form>
        
        <label for="noteTags">Tags</label>
        <input
          type="text"
          id="noteTags"
          placeholder="create tag"
          aria-label="Note Tags"
        />

        <!-- button for adding a tag
        - Create
        - drop down
         -->
        <button id="tag-create" aria-label="Button 1" title="tagcreate">+</button>
        <button id="tag-dropdown" aria-label="Button 2">&#9662;</button>
        <div id="tag-dropdown-container" class="hidden">
          <ul id="tag-dropdown-list">
            <!-- Tag options will be dynamically inserted here -->
          </ul>
        </div>
      </div>

      <ul id="tag-list">
        <!-- Tags will be dynamically inserted here -->
      </ul>

      <div id="contentContainer">
        <label for="noteContent">Content</label>
        <div
          id="noteContent"
          contenteditable="true"
          placeholder="Write your note here..."
          aria-label="Note Content"
        ></div>
      </div>

      <!-- Floating toolbar for formatting tools -->
      <div id="floatingToolbar" class="editor-options">
        <button
          id="makeUnderlineButton"
          aria-label="Underline"
          title="Underline"
          class="off"
        >
          <u>U</u>
        </button>
        <button id="makeItalicButton" aria-label="Italic" title="Italic">
          <i>I</i>
        </button>
        <button id="makeBoldButton" class="off" aria-label="Bold" title="Bold">
          <b>B</b>
        </button>
        <button
          id="insertImageButton"
          aria-label="Insert Image"
          title="Insert Image"
        >
          🖼️
        </button>
        <!--<button
          id="insertVideoButton"
          aria-label="Insert Video"
          title="Insert Video"
        >
          📹
        </button>-->
        <button
          id="insertCodeBlockButton"
          aria-label="Insert Code Block"
          title="Insert Code Block"
          class="off"
        >
          >_
        </button>
      </div>
    </section>

    <!-- NoScript tag to handle cases where JavaScript is disabled -->
    <noscript>
      <div class="noscript-warning">
        <p>
          JavaScript is disabled in your browser. Please enable JavaScript to
          use the full functionality of this site.
        </p>
      </div>
    </noscript>
`;

// Mock global functions
global.alert = jest.fn();
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};

// Mock document.execCommand
document.execCommand = jest.fn();

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock the notes API
window.notes = {
  createNote: jest.fn(),
  readNotes: jest.fn(() => []), // Return an empty array by default
  updateNote: jest.fn(),
  deleteNote: jest.fn(),
};

const initializeNoteApp = require("../src/scripts/render");
const noteApp = initializeNoteApp();
const showNoteEditor = noteApp.showNoteEditor;
const hideNoteEditor = noteApp.hideNoteEditor;
const clearNoteEditor = noteApp.clearNoteEditor;
const saveActiveNote = noteApp.saveActiveNote;
const deleteActiveNote = noteApp.deleteActiveNote;
const deleteNote = noteApp.deleteNote;
const renderNotes = noteApp.renderNotes;
const filterNotes = noteApp.filterNotes;

beforeAll(() => {
  initializeNoteApp();
});

beforeEach(() => {
  jest.clearAllMocks();
  document.getElementById("noteEditor").classList.add("hidden");
  document.getElementById("noteTitle").value = "";
  document.getElementById("noteContent").innerHTML = "";
  //empty out the tag list
  let tagList = document.getElementById("tag-list");
  while (tagList.firstChild) {
    tagList.removeChild(tagList.firstChild);
  }
  document.getElementById("noteDate").value = "";
  document.getElementById("searchInput").value = "";
  document.getElementById("notesContainer").innerHTML = "";
  activeNoteID = null; // Reset activeNoteID before each test
});

describe("showNoteEditor", () => {
  it("should show the note editor with default values for a new note", () => {
    showNoteEditor();
    expect(document.getElementById("noteTitle").value).toBe("");
    expect(document.getElementById("noteContent").innerHTML).toBe("");
    expect(document.getElementById("tag-list").children.length).toBe(0);
    expect(document.getElementById("noteDate").value).toBe(
      new Date().toISOString().substring(0, 10)
    );
    expect(
      document.getElementById("noteEditor").classList.contains("hidden")
    ).toBe(false);
  });

  it("should show the note editor with values for an existing note", async () => {
    const note = {
      ID: "1",
      title: "Existing Note",
      content: "Content",
      tags: [
        {
          content: "Tag",
          color: "red",
        },
      ],
      date: "2023-05-27",
    };
    showNoteEditor(note);
    expect(document.getElementById("noteTitle").value).toBe(note.title);
    expect(document.getElementById("noteContent").innerHTML).toBe(note.content);
    expect(document.getElementById("tag-list").children.length).toBe(1);
    expect(
      document.getElementById("tag-list").children[0].textContent
    ).toContain("Tag");
    expect(
      document.getElementById("tag-list").children[0].style.backgroundColor
    ).toBe("red");
    expect(document.getElementById("noteDate").value).toBe(note.date);
    expect(
      document.getElementById("noteEditor").classList.contains("hidden")
    ).toBe(false);
  });
});

describe("hideNoteEditor", () => {
  it("should hide the note editor and clear its fields", () => {
    hideNoteEditor();
    expect(
      document.getElementById("noteEditor").classList.contains("hidden")
    ).toBe(true);
    expect(document.getElementById("noteTitle").value).toBe("");
    expect(document.getElementById("noteContent").innerHTML).toBe("");
    expect(document.getElementById("tag-list").children.length).toBe(0);
    expect(document.getElementById("noteDate").value).toBe(
      new Date().toISOString().substring(0, 10)
    );
  });
});

describe("renderNotes", () => {
  it("should render the notes correctly", () => {
    window.notes.readNotes.mockReturnValue([
      {
        ID: "1",
        title: "Note 1",
        content: "Content 1",
        tags: [
          {
            content: "Tag",
            color: "red",
          },
        ],
        date: "2023-05-27",
      },
      {
        ID: "2",
        title: "Note 2",
        content: "Content 2",
        tags: [
          {
            content: "Tag2",
            color: "orange",
          },
        ],
        date: "2023-05-28",
      },
    ]);

    renderNotes();
    expect(document.getElementById("notesContainer").childElementCount).toBe(3); // including the header
  });
});

describe("clearNoteEditor", () => {
  it("should clear all input values in the note editor", () => {
    const note = {
      ID: "1",
      title: "Existing Note",
      content: "Content",
      tags: [
        {
          content: "Tag",
          color: "red",
        },
      ],
      date: "2023-05-27",
    };
    showNoteEditor(note);
    clearNoteEditor();
    expect(document.getElementById("noteTitle").value).toBe("");
    expect(document.getElementById("noteContent").innerHTML).toBe("");
    expect(document.getElementById("tag-list").children.length).toBe(0);
    expect(document.getElementById("noteDate").value).toBe(
      new Date().toISOString().substring(0, 10)
    );
  });
});

describe("saveActiveNote", () => {
  it("should call updateNote when saving an existing note", async () => {
    const note = {
      ID: "1",
      title: "Existing Note",
      content: "Content",
      tags: [
        {
          content: "Tag",
          color: "red",
        },
      ],
      date: "2023-05-27",
    };
    // Set activeNoteID and note editor fields
    //activeNoteID = note.ID;
    showNoteEditor(note);
    document.getElementById("noteTitle").value = "Updated Note";
    document.getElementById("noteContent").innerHTML = "Updated Content";

    await saveActiveNote();
    expect(window.notes.updateNote).toHaveBeenCalledWith(
      "1",
      "Updated Note",
      "Updated Content",
      [
        {
          content: "Tag",
          color: "red",
        },
      ],
      "2023-05-27"
    );
  });
});

describe("deleteActiveNote", () => {
  it("should call deleteNote for the active note", async () => {
    const note = {
      ID: "1",
      title: "Existing Note",
      content: "Content",
      tags: [
        {
          content: "Tag",
          color: "red",
        },
      ],
      date: "2023-05-27",
    };
    showNoteEditor(note);
    jest.spyOn(window, "confirm").mockImplementation(() => true);

    await deleteActiveNote();
    expect(window.notes.deleteNote).toHaveBeenCalledWith("1");
  });
});

describe("deleteNote", () => {
  it("should call deleteNote for a specific note ID", async () => {
    const note = {
      ID: "2",
      title: "Another Note",
      content: "Content",
      tags: [
        {
          content: "Tag",
          color: "red",
        },
      ],
      date: "2023-05-28",
    };
    jest.spyOn(window, "confirm").mockImplementation(() => true);

    await deleteNote(note.ID);
    expect(window.notes.deleteNote).toHaveBeenCalledWith("2");
  });
});

describe("filterNotes", () => {
  it("should filter notes based on search input", () => {
    window.notes.readNotes.mockReturnValue([
      {
        ID: "1",
        title: "Note 1",
        content: "Content 1",
        tags: [
          {
            content: "Tag1",
            color: "red",
          },
        ],
        date: "2023-05-27",
      },
      {
        ID: "2",
        title: "Note 2",
        content: "Content 2",
        tags: [
          {
            content: "Tag2",
            color: "orange",
          },
        ],
        date: "2023-05-28",
      },
    ]);

    document.getElementById("searchInput").value = "Note 1";
    filterNotes();
    expect(document.getElementById("notesContainer").childElementCount).toBe(2); // including the header
  });
});
