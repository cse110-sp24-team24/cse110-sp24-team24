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

  test("Create and save a note with specified data", async () => {
    // Click the 'Add Note' button
    await page.click("#addNoteButton");

    // Wait for the note editor to be displayed
    await page.waitForSelector("#noteEditor:not(.hidden)");

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

    // Wait for 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Click the 'Save' button
    await page.click("#saveNoteButton");

    // Wait for the note editor to be hidden
    await page.waitForSelector("#noteEditor.hidden");

    // Check if the note editor is hidden
    const isNoteEditorHidden = await page.evaluate(() => {
      return document.getElementById("noteEditor").classList.contains("hidden");
    });

    // Expect the note editor to be hidden
    expect(isNoteEditorHidden).toBe(true);
  }, 10000); // Set timeout to 10 seconds (10000 milliseconds)
});
