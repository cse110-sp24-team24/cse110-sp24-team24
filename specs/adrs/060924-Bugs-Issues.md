# ADR - Bug Tracking and Solutions

## Context and Problem Statement

Throughout the development of our project, several bugs and issues have been identified. These range from functionality limitations to potential risks and errors. It's imperative to document these issues along with the proposed solutions for clarity and future reference. As we have run out of time to address these issues, we made sure to properly document them as well as provide potential solutions to these issues for future reference.

## Bugs and Issues Identified

1. **Tag Alert and Editing Issue**:
   - **Description:** When adding a tag with content matching an existing tag from the dropdown, an alert is displayed. After dismissing the alert, further editing becomes impossible, leading to the need for restarting the application.
   - **Solution:** Debugging indicates a potential issue with non-native Electron alerts. This [Stack Overflow](https://stackoverflow.com/questions/71534851/unable-to-edit-input-element-after-an-alert-in-electron)  as well as this [Stack Overflow](https://stackoverflow.com/questions/56805920/cant-edit-input-text-field-after-window-alert) link offer insights into resolving this issue by adapting Electron-native alerts.

2. **E2E Testing Limitation**:
   - **Description**: E2E testing with Jest is hindered due to the discrepancy between Jest, which operates from Node, and Electron, which requires Webpack. Due to this issue and time constraint, we were unable to implement E2E testing for our `saveNote` and `deleteNote` tests. 
   - **Solution**: Referencing the provided [Stack Overflow](https://stackoverflow.com/questions/46898185/electron-jest-ipcrenderer-is-undefined-in-unit-tests) link suggests potential resolutions to integrate Jest with Electron seamlessly for comprehensive testing.

3. **Inability to Remove or Edit Tags**:
   - **Description:** Tags cannot be removed or edited once added.
   - **Solution:** This issue needs further investigation to identify the root cause and implement a fix.

4. **Deprecated Document.execCommand() Usage**:
   - **Description:** Utilization of `Document.execCommand()` for text styling poses accessibility risks due to deprecation and potential browser compatibility issues.
   - **Solution:** Despite the deprecation, no viable alternatives are available. The decision to continue using `Document.execCommand()` is justified by the idea that having features was much more beneficial to users that not having them.

5. **Text Styling Bug**:
   - **Description:** Underlining text, followed by typing on an empty note editor, causes the first character to remain underlined.
   - **Solution:** Investigate potential conflicts with Document.execCommand() and implement corrective measures to ensure consistent text styling behavior.

6. **Image Constraints**:
   - **Description:** Manual image resizing within notes proved challenging, leading to the implementation of size constraints.
   - **Solution:** While constraints ensure consistency, exploring options for user-controlled resizing may enhance flexibility in the future.

7. **Code Block Implementation**:
   - **Description:** Initially used the `<pre><code>` structure for our code blocks as 1) they would follow semantic html standards (as this method is very standard implementation for code blocks) 2) the code and its formatting could be easily saved in the json files as note content is saved by innerHTML and 3) it would be flexible to additional features (especially code syntax highlighting).
   - **Solution:** Opted for using the `<textarea></textarea> `element as this proved to be less buggy. Our first method would mess with the overall formatting of the notes and so our latter option was best for more predictable and consistent behavior. Initial implementation using `<pre><code>` structure resulted in formatting inconsistencies.

8. **Initial Note Error Message**:
   - **Description:** Upon creating the first note or tag, an error message regarding missing JSON files is logged.
   - **Solution:** This error message should be addressed to prevent confusion and improve user experience.

9. **Preservation of Underline in Code Block**:
   - **Description:** Applying underline before creating a code block results in the underline being preserved within the code block.
   - **Solution:** Investigate the interaction between text styling and code block rendering to ensure consistent behavior.

10. **Module Loading Error in render.js**:
    - **Description:** During render.js loading, a module loading error is encountered.
    - **Solution:** Transition render.js to utilize module support in Jest to resolve the loading error.

11. **Error Handling for Render Notes**:
    - **Description:** Poorly formatted tags and notes trigger errors in render notes and fail to close the showNotesEditor.
    - **Solution:** Enhance error handling to accommodate potential changes in note formatting and prevent application disruption.

## Decision Outcome

The team acknowledges the identified bugs and issues and commits to address them in future development cycles as well as notify any future developers of the current issues. Prioritization will be based on severity and impact on user experience, with a focus on enhancing functionality, improving stability, and ensuring compatibility across platforms and environments. However, due to the time constraint of the project, we were unable to address these bugs and issues but decided to document them as well as potential solutions for future reference.
