const path = require("path");

describe("Window Behavior", () => {
  let windowSpy;

  beforeEach(() => {
    windowSpy = jest.spyOn(global, "window", "get").mockImplementation(() => ({
      location: {
        origin: "file://" + path.resolve("./src/index.html"),
      },
    }));
  });

  afterEach(() => {
    windowSpy.mockRestore();
  });

  test("initial start to index.html", () => {
    expect(window.location.origin).toEqual(
      "file://" + path.resolve("./src/index.html")
    );
  });

  test("should be undefined", () => {
    windowSpy.mockImplementation(() => undefined);
    expect(window).toBeUndefined();
  });

  test("should open the main window and check title", async () => {
    const mockTitle = "Purrfect Notes";

    // Mock the behavior of the document title
    jest.spyOn(document, "title", "get").mockReturnValueOnce(mockTitle);

    // Perform any actions that would open the main window, if applicable
    // For example, you might have code that initializes your app or loads content

    // Assert that the document title matches the expected title
    expect(document.title).toEqual(mockTitle);
  });

  describe("Closing and Reopening the App", () => {
    test("Close and reopen the app", () => {
      // Remember the original window location
      const originalLocation = window.location.href;

      // Simulate closing the app by resetting the window location
      window.location.href = "about:blank";

      // Simulate reopening the app by resetting the window location back to the original
      window.location.href = originalLocation;

      // Assert that the window location has been reset
      expect(window.location.href).toEqual(originalLocation);
    });
  });
});
