// Unit.test.js

// Set up DOM elements
document.body.innerHTML = `
    <!-- Sidebar with navigation buttons -->
    <div class="sidebar">
      <button id="homeButton" aria-label="Home">🏠 Home</button>
      <button id="addNoteButton" aria-label="Add Note">➕ Add Note</button>
    </div>
    <!-- Main content area -->
    <div class="main-content">
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
      <div id="notesContainer">
        <h2>Your Journals:</h2>
        <!-- Notes will be dynamically inserted here -->
      </div>
    </div>
    <div id="noteEditor" class="hidden">
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
        <button id="tag-create" aria-label="Button 1">+</button>
        <button id="tag-dropdown" aria-label="Button 1">&#9662;</button>
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
        >
          <u>U</u>
        </button>
        <button id="makeItalicButton" aria-label="Italic" title="Italic">
          <i>I</i>
        </button>
        <button id="makeBoldButton" aria-label="Bold" title="Bold">
          <b>B</b>
        </button>
        <button id="addImageButton" aria-label="Add Image" title="Insert Image">
          🖼️
        </button>
        <button id="addVideoButton" aria-label="Add Video" title="Insert Video">
          📹
        </button>
        <button
          id="addCodeBlockButton"
          aria-label="Add Code Block"
          title="Insert Code Block"
        >
        </button>
      </div>
    </div>
`;

// Mock global functions
global.alert = jest.fn();
global.localStorage = {
  getItem: jest.fn(() =>
    JSON.stringify([
      {
        title: "Existing Note",
        content: "new stuff",
        tags: "Tag",
        date: "2023-05-27",
      },
    ])
  ),
  setItem: jest.fn(),
};

// Mock EasyMDE
let mockEasyMDEValue = "";
const mockEasyMDE = {
  value: jest.fn((content) => {
    if (content === undefined) {
      return mockEasyMDEValue;
    } else {
      mockEasyMDEValue = content;
    }
  }),
  codemirror: {
    refresh: jest.fn(),
  },
  toTextArea: jest.fn(),
};
beforeAll(() => {
  document.execCommand = jest.fn();
});

global.EasyMDE = jest.fn().mockImplementation(() => mockEasyMDE);

const {
  addTag,
  showTagDropdown,
  hideTagDropdown,
  // removeTag,
  // loadTags,
  // addTagFromDropdown,
} = require("./../src/scripts/script.js");

// Unit tests for the tag system

describe("Tag System", () => {
  let noteTags = document.getElementById("noteTags");
  let tagList = document.getElementById("tag-list");
  let tagDropdownContainer = document.getElementById("tag-dropdown-container");

  it("should add a new tag", () => {
    noteTags.value = "Test Tag";
    noteTags.style.backgroundColor = "red";
    addTag();
    expect(tagList.children.length).toBe(1);
    expect(tagList.children[0].textContent).toContain("Test Tag");
    expect(tagList.children[0].style.backgroundColor).toBe("red");
  });

  it("should show the tag dropdown", () => {
    showTagDropdown();
    expect(tagDropdownContainer.classList.contains("hidden")).toBe(false);
  });

  it("should hide the tag dropdown", () => {
    hideTagDropdown();
    expect(tagDropdownContainer.classList.contains("hidden")).toBe(true);
  });

  it("should add tag from dropdown", () => {

  });

  it("should not add an empty tag", () => {

  });

  it("should not add a duplicate tag", () => {

  });

  it("should remove a tag", () => {

  });
});
