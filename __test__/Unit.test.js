// Unit.test.js

// Set up DOM elements
document.body.innerHTML = `
    <input type="text" id="noteTags" />
    <ul id="tag-list"></ul>
    <div id="tag-dropdown-container" class="hidden"></div>
    <input type="color" id="tagColorButton" />
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
  // removeTag,
  // loadTags,
  // addTagFromDropdown,
} = require("./../src/scripts/script.js");

// const jest1 = require("jest-mock");

// Unit tests for the tag system

describe("Tag System", () => {

  let noteTags = document.getElementById("noteTags");
  let tags = document.getElementById("tag-list");
  let tagDropdownContainer = document.getElementById("tag-dropdown-container");
  let tagColorButton = document.getElementById("tagColorButton");

  beforeAll(() => {
    // // Mock global alert function
    // global.alert = jest1.fn();

    // // Mock localStorage
    // global.localStorage = {
    //   getItem: jest1.fn(),
    //   setItem: jest1.fn(),
    // };
    document.body.innerHTML = `
      <input type="text" id="noteTags" />
      <ul id="tag-list"></ul>
      <div id="tag-dropdown-container" class="hidden"></div>
      <input type="color" id="tagColorButton" />
    `;
    // Mock localStorage data
    localStorage.setItem("notes", JSON.stringify([]));
    localStorage.setItem("tags", JSON.stringify([]));
  });

  it("should add a new tag", () => {
    noteTags.value = "Test Tag";
    noteTags.style.backgroundColor = "red";
    addTag();
    const addedTag = tags.find(
      (tag) => tag.content === "Test Tag" && tag.color === "red"
    );
    expect(addedTag).toBeDefined();
  });

  it("should change tag color", () => {
    // Simulate the tag color change event
    const newColor = "#00ff00";
    tagColorButton.value = newColor;
    const event = new Event("change");
    tagColorButton.dispatchEvent(event);

    // Check if the color change was applied
    expect(noteTags.style.backgroundColor).toBe(newColor);
  });

  it("should show the tag dropdown", () => {
    showTagDropdown();
    expect(tagDropdownContainer.classList.contains("hidden")).toBe(false);
  });
  // it("should not add an empty tag", () => {
  //   noteTags.value = "";
  //   addTag();
  //   expect(tags.length).toBe(0);
  // });

  // it("should not add a duplicate tag", () => {
  //   noteTags.value = "Test Tag";
  //   noteTags.style.backgroundColor = "red";
  //   addTag();
  //   addTag();
  //   expect(tags.length).toBe(1);
  // });

  // it("should remove a tag", () => {
  //   noteTags.value = "Test Tag";
  //   noteTags.style.backgroundColor = "red";
  //   addTag();
  //   const tagElement = tagList.querySelector("li");
  //   removeTag(tagElement);
  //   expect(tags.length).toBe(0);
  // });

  // it("should load tags into the dropdown", () => {
  //   tags = [
  //     { content: "Tag1", color: "red" },
  //     { content: "Tag2", color: "blue" },
  //   ];
  //   localStorage.setItem("tags", JSON.stringify(tags));
  //   loadTags();
  //   expect(tagDropdownList.children.length).toBe(2);
  // });

  // it("should add tag from dropdown", () => {
  //   tags = [{ content: "Tag1", color: "red" }];
  //   localStorage.setItem("tags", JSON.stringify(tags));
  //   loadTags();
  //   const tagItem = tagDropdownList.querySelector("li");
  //   addTagFromDropdown({ content: "Tag1", color: "red" });
  //   const addedTag = Array.from(tagList.getElementsByTagName("li")).find(
  //     (li) => li.textContent.trim() === "Tag1"
  //   );
  //   expect(addedTag).toBeDefined();
  // });
});
