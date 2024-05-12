# **Meeting Notes**

## Meeting Details:

- **Date:** May 9, 2024
- **Time:** 5:30 PM - 7:30 PM
- **Location:** In person: CTL 0125
- **Attendees:** Cynthia, Sarvesh, Ishaan, Jeffrey, Terrence, Harsh, Geena, Kiera, David, Sofia
- **Absentees:** Eugenie

## **Agenda:**

- Add additional info to project from feedback from TA
  - Database
  - Unit Testing
  - Timeline
  - Non-Functional Features
- Establish a timeline
- Go over how to establish the note-taking feature
- Go over CI/CD assignment

## **Notes:**

- **Unit Testing:** Use jest & pupeteer
  - unit testing parallelly with development
- **Database:** tentatively electron.js(?)
  - ask follow up questions to TA regarding that
  - Store locally on computer
- **Timeline:**
  - Week 7:
    - one note part
    - text, saving, editting — (figuring electron)
    - Finish text document
  - Week 8:
    - expand to multiple notes
    - Work on Homepage
  - Week 9:
    - Fix bugs
  - May 25th have first prototype done
  - Week 10 - 11
    - Add features we wanted to earlier if time permits
- **Non-functional features:**

  - **Performance:**
    - Faster than 3 seconds (the average load time on desktop on google)
  - **Accessibility:**
    - Accessible color palette (color blind friendly)
    - Screen reader compatibility
    - Using electron.js so only local to computer

- Split into teams
  - store the data
  - setting up infrastructure (electron)
  - making a text editor
- Keep local
- **CI/CD:**

  - Unit Testing
    - Jest
  - E2E testing
    - pupeteer
  - Linting and code style
    - EsLint (github actions)
    - Prettier
  - Documentation generation via automation
    - JSDocs
  - Code quality via human review
    - Pull Requests
      - 2 reviews per PR (not on your team)

- **Branch Structure:**
  - main: finished product for shipment
  - develop: all teams merged code (a little stricter)
  - 5 team based branches (for teams to work together)

## **Before Next Meeting:**

- Work on assigned CI/CD portion
- Start coordinating with group for sprint of week 7
