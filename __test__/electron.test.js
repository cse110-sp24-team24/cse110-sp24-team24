//if you close a window with pupeteer confirm the app is still running and make sure you can stil open it

const puppeteer = require("puppeteer");
const path = require("path");

describe("Testing Window Functionality", () => {
  let browser;
  let page;

  beforeAll(async () => {
    // Launch the Electron app using Puppeteer
    browser = await puppeteer.launch({
      executablePath: require("electron"), // Use 'require("electron")' to get the path to the Electron executable
      args: [path.resolve("./src/index.html")], // Provide arguments as an array
    });

    // Create a new page
    const pages = await browser.pages(); // Get all open pages
    page = pages[0]; // Use the first page (Electron window)
  });

  afterAll(async () => {
    // Close the browser instance
    await browser.close();
  });

  test("should open the main window", async () => {
    // Example: Check if the page title matches
    await page.waitForSelector("title"); // Wait for the title element to be available
    const pageTitle = await page.title();
    expect(pageTitle).toBe("Dev Journal");
  });

  test("should reopen the app after closing", async () => {
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

  test("should open the main window AGAIN", async () => {
    // Example: Check if the page title matches
    await page.waitForSelector("title"); // Wait for the title element to be available
    const pageTitle = await page.title();
    expect(pageTitle).toBe("Dev Journal");
  });
});
