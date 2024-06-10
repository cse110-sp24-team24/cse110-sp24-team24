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
      slowMo: 25, // 25 milliseconds delay between operations
      ignoreDefaultArgs: ["--disable-features=site-per-process"] // Disable WebSocket support
    });
  
    // Create a new page
    const pages = await browser.pages();
    page = pages[0];
  });

  afterAll(async () => {
    try {
      // Close the browser instance
      await browser.close();
    } catch (error) {
      console.error("Error closing browser:", error);
    }
  });

  test("Open the main window and check title", async () => {
    await page.waitForSelector("title");
    const pageTitle = await page.title();
    expect(pageTitle).toBe("Purrfect Notes");
  });

  // test("Reopen the app after closing", async () => {
  //   // Navigate to a new URL to simulate reopening the app
  //   await page.goto("about:blank");
  //   // Wait for a short period to ensure the page is loaded
  //   await page.waitForTimeout(1000);
  //   // Navigate back to the app URL
  //   await page.goto("file://" + path.resolve("./src/index.html"));

  //   await page.waitForSelector("title");
  //   const newPageTitle = await page.title();
  //   expect(newPageTitle).toBe("Purrfect Notes");
  // });
    test("Reopen the app after closing", async () => {
    // Navigate to a new URL to simulate reopening the app
    await page.goto("about:blank");
    // Wait for a short period to ensure the page is loaded
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Navigate back to the app URL
    await page.goto("file://" + path.resolve("./src/index.html"));

    await page.waitForSelector("title");
    const newPageTitle = await page.title();
    expect(newPageTitle).toBe("Purrfect Notes");
  });

  test("Cancel note and close editor window", async () => {
    await page.click("#addNoteButton");
    await page.waitForSelector("#noteEditor:not(.hidden)");

    await page.waitForSelector("#cancelButton", { visible: true });
    await page.click("#cancelButton");

    await page.waitForSelector("#noteEditor.hidden");

    // Check if the note editor is hidden
    const isNoteEditorHidden = await page.evaluate(() => {
      const noteEditor = document.querySelector("#noteEditor");
      return noteEditor.classList.contains("hidden");
    });
    expect(isNoteEditorHidden).toBe(true);

    // Check if the save button is not clicked
    const isSaveButtonClicked = await page.evaluate(() => {
      const saveButton = document.querySelector("#saveNoteButton");
      return saveButton.classList.contains("clicked");
    });
    expect(isSaveButtonClicked).toBe(false);
  }, 20000);

  test("Add new note", async () => {
    await page.click("#addNoteButton");
    await page.waitForSelector("#noteEditor:not(.hidden)");

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

    // Verify each input
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
  }, 150000);

  test("Apply bold, italic, and underline styles to text", async () => {
    // Select the text
    await page.evaluate(() => {
      const range = document.createRange();
      const textNode = document.querySelector("#noteContent").firstChild;
      range.selectNodeContents(textNode);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    });

    // Apply bold style
    await page.click("#makeBoldButton");

    // Check if the text is bold
    const isBold = await page.evaluate(() => {
      return document.queryCommandState("bold");
    });

    // Expect the text to be bold
    expect(isBold).toBe(true);

    // Apply italic style
    await page.click("#makeItalicButton");

    // Check if the text is italic
    const isItalic = await page.evaluate(() => {
      return document.queryCommandState("italic");
    });

    // Expect the text to be italic
    expect(isItalic).toBe(true);

    // Apply underline style
    await page.click("#makeUnderlineButton");

    // Check if the text is underlined
    const isUnderlined = await page.evaluate(() => {
      return document.queryCommandState("underline");
    });

    // Expect the text to be underlined
    expect(isUnderlined).toBe(true);
  });
});

  // test("Cancel note and close editor window", async () => {
  //   await page.click("#addNoteButton");
  //   await page.waitForSelector("#noteEditor:not(.hidden)");

  //   await page.waitForSelector("#cancelButton", { visible: true });
  //   await page.click("#cancelButton");

  //   await page.waitForSelector("#noteEditor.hidden");

  //   // Check if the note editor is hidden
  //   const isNoteEditorHidden = await page.evaluate(() => {
  //     const noteEditor = document.querySelector("#noteEditor");
  //     return noteEditor.classList.contains("hidden");
  //   });
  //   expect(isNoteEditorHidden).toBe(true);

  //   // Check if the save button is not clicked
  //   const isSaveButtonClicked = await page.evaluate(() => {
  //     const saveButton = document.querySelector("#saveNoteButton");
  //     return saveButton.classList.contains("clicked");
  //   });
  //   expect(isSaveButtonClicked).toBe(false);
  // });

  // test("Add new note", async () => {
  //   // Logic to add a new note
  //   // Simulate adding a new note and verify its presence
  // });

  // test("Apply bold, italic, and underline styles to text", async () => {
  //   // Logic to apply styles to text
  //   // Simulate applying bold, italic, and underline styles to text and verify the changes
  // });

