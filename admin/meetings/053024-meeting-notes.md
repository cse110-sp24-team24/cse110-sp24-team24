# **Meeting Notes**

## Meeting Details:

- **Date:** May 30, 2024
- **Time:** 3:00 PM - 3:45 PM
- **Location:** Zoom
- **Attendees:** Cynthia, Sarvesh, Ishaan, Harsh, Kiera, Sofia, Eugenie
- **Absentees:** Jeffrey, Terrence, David, Geena

## **Agenda:**

- Discuss Cynthia and Ishaan's meeting with TA
- Review sprint progress
- Any necessary changes
- Action items

## **Notes:**

### Meeting with TA

- Need to have JSDocs everywhere
- Every branch should have a good README explaining what the branch is doing
  - The main branch README should also be updated to add information about project structure and progress
- Add E2E and unit tests to each branch

### Sprint progress

- Team 1: Electron and file storage
  - Electron file storage is done!
  - Created functions to read and update the notes
  - Added ID numbers to each note for better usage
- Team 2: API
  - Eugenie
    - Reorganized file system on deploy branch to remove repeated/unneccesary files and make file system easier to understand
    - Changed functionality of search bar to just search by title of note
  - Sofia
    - Changed color wheel to a simple color picker from preseleceted colors (for choosing color of tags)
    - Will create an ADR for this decision
  - Harsh
    - Implemented dropdown so user can add a tag from previously created tags
    - Added filter button to search bar - need to debug
- Team 3: HTML and UI
  - Ishaan and Sarvesh
    - Finished unit tests for UI! Once team 2 is done with filter button, will add that to unit tests as well
    - Need to add E2E tests
  - Cynthia and Jeffrey
    - Worked on adding code editor to text blocks in notes
    - Hard to add code with basic JS, found [this library](https://github.com/Ionaru/easy-markdown-editor?tab=readme-ov-file) that allows us to write in Markdown and then render it
      - TA approved library if we deem it to be necessary

### Changes decided on

- Try to modify the note rendering on the home page so that the text shows up as pretty text instead of raw markdown
  - If not possible, don't display the note text on the home page - for each note, just show the title, tags, date, etc.
- Depending on how note text rendering goes, we may or may not add functionality to search by content and not just title.

## **Action Items**

- Team 1
  - Work with Team 3 to create unit tests that use new note ID system
- Team 2
  - Finish ADR for decision to change color wheel
  - Create JSON object for tags that stores text and color
- Team 3
  - Modify note content rendering on home page as decided above
- Everyone
  - Finish tasks for this sprint by Friday (May 31st) night
  - Merge branch into `deploy` whenever ready
  - Review PR's made for ADR updates (and just in general be on the lookout for PR's that need approval)
