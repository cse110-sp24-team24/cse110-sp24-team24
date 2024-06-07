// Need to run following commands to run the tests:
// npm install
// npm install --save-dev jest-environment-jsdom
// npm test
// Mock global functions
global.alert = jest.fn();
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};

// Mock document.execCommand
//document.execCommand = jest.fn();

const { addTag } = require('../src/scripts/script.js');

describe('addTag', () => {
  beforeEach(() => {
    // Set up mock DOM
    document.body.innerHTML = `
      <ul id="tag-list"></ul>
      <input
          type="text"
          id="noteTags"
          placeholder="create tag"
          aria-label="Note Tags"
        />
    `;
  });

  it('adds a tag to the tags array and updates the DOM', () => {
    const tagText = "Tag";
    document.getElementById('noteTags').value = tagText;

    // Call the function
    addTag();

    // Check the result
    expect(document.querySelector('#tag-list').children.length).toBe(1);
    expect(document.querySelector('#tag-list').textContent).toContain(tagText);
  });
});
