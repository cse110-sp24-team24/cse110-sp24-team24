const puppeteer = require("puppeteer");
const path = require("path");

describe("Testing Window Functionality", () => {
  let browser;
  let page;

  beforeAll(async () => {
    // Launch the Electron app using Puppeteer
    browser = await puppeteer.launch({
      executablePath: require("electron"),
      args: [path.resolve("./src/index.html")],
    });

    // Create a new page
    const pages = await browser.pages(); // Get all open pages
    page = pages[0]; // Use the first page (Electron window)
  });

  afterAll(async () => {
    // Close the browser instance
    await browser.close();
  });

  test("Open the main window", async () => {
    // Example: Check if the page title matches
    await page.waitForSelector("title"); // Wait for the title element to be available
    const pageTitle = await page.title();
    expect(pageTitle).toBe("Dev Journal");
  });

  test("Reopen the app after closing", async () => {
    // Navigate to a new URL to simulate reopening the app
    await page.goto("about:blank");
    // Wait for a short period to ensure the page is loaded
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Navigate back to the app URL
    await page.goto("file://" + path.resolve("./src/index.html"));

    // Wait for the title element to be available
    await page.waitForSelector("title");
    // Get the title of the page
    const newPageTitle = await page.title();

    // Expect the title to match the expected title
    expect(newPageTitle).toBe("Dev Journal");
  });

  test("Click Add Note and open the note editor window", async () => {
    // Click the 'Add Note' button
    await page.click("#addNoteButton");

    // Wait for the note editor to be displayed
    await page.waitForSelector("#noteEditor:not(.hidden)");

    // Check if the note editor is displayed
    const noteEditor = await page.$("#noteEditor");
    const isNoteEditorVisible = await noteEditor.evaluate(
      (el) => !el.classList.contains("hidden")
    );

    // Expect the note editor to be visible
    expect(isNoteEditorVisible).toBe(true);
  });

  test("Fill note with details and verify each input", async () => {
    // Wait for the input fields to appear
    await page.waitForSelector("#noteTitle");
    await page.waitForSelector("#noteTags");
    await page.waitForSelector("#noteContent");
    await page.waitForSelector("#noteDate");

    // Fill in the note details
    await page.type("#noteTitle", "Write unit tests");
    await page.type("#noteTags", "TEST");
    await page.type(
      "#noteContent",
      "Write unit tests using puppeteer and chat"
    );

    // Set the date to tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowISOString = tomorrow.toISOString().substring(0, 10);
    await page.evaluate((tomorrowISOString) => {
      document.getElementById("noteDate").value = tomorrowISOString;
    }, tomorrowISOString);

    // Retrieve the value of each input field
    const noteTitleValue = await page.$eval(
      "#noteTitle",
      (input) => input.value
    );
    const noteDateValue = await page.$eval("#noteDate", (input) => input.value);
    const noteTagsValue = await page.$eval("#noteTags", (input) => input.value);
    const noteContentValue = await page.$eval(
      "#noteContent",
      (div) => div.textContent
    );

    // Assert that the content has been successfully entered into each input field
    expect(noteTitleValue).toBe("Write unit tests");
    expect(noteDateValue).toBe(tomorrowISOString);
    expect(noteTagsValue).toBe("TEST");
    expect(noteContentValue).toBe("Write unit tests using puppeteer and chat");
  }, 10000); // Set timeout to 10 seconds (10000 milliseconds)

//   test('Clicking the "Delete" button in the note should remove the note from the home page', async () => {
//     console.log('Checking the "Delete" button in the note...');

    
//     // Wait for the note editor to be displayed
//     await page.waitForSelector("#noteEditor:not(.hidden)");
    
//     // Check if the note editor is displayed
//     const noteEditor = await page.$("#noteEditor");
//     const isNoteEditorVisible = await noteEditor.evaluate(
//       (el) => !el.classList.contains("hidden")
//       );
      
//     // Click the 'Add Note' button
//     await page.click("#deleteNoteButton");
// // In your Puppeteer test
// test('Clicking the "Delete" button should trigger deletion with confirmation', async () => {
//   // Trigger the deletion function by clicking the delete button
//   await page.click('#deleteNoteButton');

//   page.on('dialog', async dialog => {
//     await dialog.accept();
// });

// // Check if the note has been deleted from the UI
// const deletedNote = await page.evaluate(() => {
//   return document.querySelector('.note'); // Adjust the selector based on your UI structure
// });

// // Ensure that the note no longer exists
// expect(deletedNote).toBeNull();
// });
// }, 30000);


  // test("Deleting a note on the home page", async () => {
  //   // Click on the delete button of the first note
  //   await page.click(".note:nth-child(1) .delete-note");
  //   // Accept the confirmation dialog
  //   await page.waitForSelector(".note:nth-child(1)", { hidden: true });
  //   // Ensure the note is removed from the page
  //   const notesCount = await page.$$eval(".note", (notes) => notes.length);
  //   expect(notesCount).toBe(initialNotesCount - 1); // Adjust initialNotesCount accordingly
  // });

  // test("Deleting a note on the home page", async () => {
  //   // Wait for the delete buttons to appear
  //   await page.waitForSelector("#deleteNoteButton");
  
  //   // Click on the delete button of the first note
  //   await page.click("#deleteNoteButton");
  
  //   // Wait for the confirmation dialog
  //   await page.waitForSelector(".note:nth-child(1)");
  
  //   // Accept the confirmation dialog
  //   await page.evaluate(() => {
  //     const confirmationButton = document.querySelector(".note:nth-child(1) deleteNoteButton");
  //     confirmationButton.click();
  //   });
  
  //   // Ensure the note is removed from the page
  //   await page.waitForSelector(".note:nth-child(1)", { hidden: true });
  
  //   // Ensure notes are rerendered
  //   const notesCount = await page.$$eval(".note", (notes) => notes.length);
  //   expect(notesCount).toBe(initialNotesCount - 1); // Adjust initialNotesCount accordingly
  // }, 30000);

  
//   test("Apply bold, italic, and underline styles to text by typing", async () => {
//     // Wait for the note editor to be displayed
//     await page.waitForSelector("#noteEditor:not(.hidden)");
  
//     // Type some text into the content area
//     await page.type("#noteContent", "This is a test text.");
  
//     // Click on the text to set the cursor
//     await page.click("#noteContent");
  
//     // Apply bold style
//     await page.click("#makeBoldButton");
  
//     // Check if the text is bold
//     const isBold = await page.evaluate(() => {
//       const selection = window.getSelection();
//       const range = selection.getRangeAt(0);
//       return document.queryCommandState('bold');
//     });
  
//     // Expect the text to be bold
//     expect(isBold).toBe(true);
  
//     // Apply italic style
//     await page.click("#makeItalicButton");
  
//     // Check if the text is italic
//     const isItalic = await page.evaluate(() => {
//       const selection = window.getSelection();
//       const range = selection.getRangeAt(0);
//       return document.queryCommandState('italic');
//     });
  
//     // Expect the text to be italic
//     expect(isItalic).toBe(true);
  
//     // Apply underline style
//     await page.click("#makeUnderlineButton");
  
//     // Check if the text is underlined
//     const isUnderlined = await page.evaluate(() => {
//       const selection = window.getSelection();
//       const range = selection.getRangeAt(0);
//       return document.queryCommandState('underline');
//     });
  
//     // Expect the text to be underlined
//     expect(isUnderlined).toBe(true);
// });
  
  
  // test("Applying bold, italics, and underline formatting", async () => {
  //   // Test bold formatting
  //   await applyTextFormatting("Bold", "B", "b");
  //   // Test italics formatting
  //   await applyTextFormatting("Italic", "I", "i");
  //   // Test underline formatting
  //   await applyTextFormatting("Underline", "U", "u");
  // });
  
  // async function applyTextFormatting(format, buttonText, expectedValue) {
  //   // Click the corresponding formatting button
  //   await page.click(`#make${format}Button`);
  //   // Check if the button toggles the formatting
  //   const appliedFormat = await getAppliedFormat();
  //   expect(appliedFormat).toContain(expectedValue);
  
  //   // Type text and ensure formatting is maintained
  //   await page.keyboard.type("Text with " + buttonText + " formatting");
  //   const formattedText = await page.evaluate(() => document.querySelector("#noteContent").innerHTML);
  //   expect(formattedText).toContain(expectedValue);
  
  //   // Clear the text for the next test
  //   await page.evaluate(() => document.querySelector("#noteContent").innerHTML = "");
  // }
  
  // async function getAppliedFormat() {
  //   return await page.evaluate(() => {
  //     const noteContent = document.getElementById("noteContent");
  //     return {
  //       bold: noteContent.style.fontWeight === "bold",
  //       italic: noteContent.style.fontStyle === "italic",
  //       underline: noteContent.style.textDecoration === "underline"
  //     };
  //   });
  // }
  
  // test("Selecting then typing text", async () => {
  //   // Select a portion of text
  //   await page.evaluate(() => {
  //     const noteContent = document.getElementById("noteContent");
  //     const range = new Range();
  //     range.setStart(noteContent.childNodes[0], 5);
  //     range.setEnd(noteContent.childNodes[0], 10);
  //     const selection = window.getSelection();
  //     selection.removeAllRanges();
  //     selection.addRange(range);
  //   });
  //   // Type new content
  //   await page.keyboard.type("New Text");
  //   // Get the updated content
  //   const updatedContent = await page.evaluate(() => document.getElementById("noteContent").innerHTML);
  //   expect(updatedContent).toContain("New Text");
  // });
  
  // test("Highlighting then applying formatting", async () => {
  //   // Highlight a portion of text
  //   await page.evaluate(() => {
  //     const noteContent = document.getElementById("noteContent");
  //     const range = new Range();
  //     range.setStart(noteContent.childNodes[0], 5);
  //     range.setEnd(noteContent.childNodes[0], 10);
  //     const selection = window.getSelection();
  //     selection.removeAllRanges();
  //     selection.addRange(range);
  //   });
  //   // Apply bold formatting
  //   await page.click("#makeBoldButton");
  //   // Apply italics formatting
  //   await page.click("#makeItalicButton");
  //   // Apply underline formatting
  //   await page.click("#makeUnderlineButton");
  //   // Get the formatted content
  //   const formattedContent = await page.evaluate(() => document.getElementById("noteContent").innerHTML);
  //   expect(formattedContent).toContain("<b><i><u>"); // Adjust the expected format accordingly
  // });  

  /**
  test("Back to home page after saving the note", async () => {
    // Click on save button to save the note
    await page.click("#saveNoteButton");

    // Wait for the note editor to be hidden
    await page.waitForSelector("#noteEditor.hidden");

    // Check if the note editor is hidden
    const noteEditorHidden = await page.$eval("#noteEditor", (editor) =>
      editor.classList.contains("hidden")
    );

    // Expect the note editor to be hidden
    expect(noteEditorHidden).toBe(true);

    // Assert that the editor window is closed
    const isEditorClosed = await page.$eval(
      "#editorWindow",
      (editor) => editor.style.display === "none"
    );
    expect(isEditorClosed).toBe(true);
    */

  /**
    // Wait for the editor window to close
    await page.waitForSelector("#editorWindow", { hidden: true });

    // Assert that the editor window is closed
    const isEditorClosed = await page.$eval(
      "#editorWindow",
      (editor) => editor.style.display === "none"
    );
    expect(isEditorClosed).toBe(true);
    */

  // Assert that we are in the home page again
  // const currentURL = page.url();
  // expect(currentURL).toMatch(/\/home$/);

  /**
    // Check if the note editor is displayed
    const noteEditor = await page.$("#noteEditor");
    const isNoteEditorVisible = await noteEditor.evaluate(
      (el) => !el.classList.contains("hidden")
    );

    // Expect the note editor to be not visible
    expect(isNoteEditorVisible).toBe(false);

    // Verify that we're back to the home page by checking the page title
    await page.waitForSelector("title"); // Wait for the title element to be available
    const pageTitle = await page.title();
    expect(pageTitle).toBe("Dev Journal");
  }, 10000); // Set timeout to 10 seconds (10000 milliseconds) to ensure enough time for the page to load
  */

  /**
  test("Cancel note", async () => {
    // Click the 'Add Note' button
    await page.click("#addNoteButton");

    await page.type("#noteTitle", "Cancel this note");

    // Wait for 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Click the 'Cancel' button
    await page.click("#cancelButton");

    // Wait for the note editor to be hidden
    await page.waitForSelector("#noteEditor.hidden");

    // Check if the note editor is hidden
    const isNoteEditorHidden = await page.evaluate(() => {
      const noteEditor = document.querySelector("#noteEditor");
      return noteEditor.classList.contains("hidden");
    });

    // Expect the note editor to be hidden
    expect(isNoteEditorHidden).toBe(true);

    // back to main page
    await page.waitForSelector("title"); // Wait for the title element to be available
    const pageTitle = await page.title();
    expect(pageTitle).toBe("Dev Journal");
  }, 3000); // Set timeout to 3 seconds (3000 milliseconds) to account for the waiting time and the actual action
  */
});
