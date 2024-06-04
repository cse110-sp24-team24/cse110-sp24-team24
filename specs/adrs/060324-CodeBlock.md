# ADR - Code Block Feature

## Context and Problem Statement

A code block feature will allow user to be able to write down any code on their note which will allow for a more organization note that separates developer's code with their text.

## Considered Options (in order of past to most recent)

The code box  was our first choice at the start of the sprint. 
* **Code Box**: To allow users to write down code we want users to be able to add a code block which is a different box that differentiate the html text with the text written in the box. This allows users to be able to separate their text from the note and any code they want to add for reference. Code box had a few bugs with showing within the note content when button was pressed and had no styling which made code look very similar to text in note.
  
* **Code Editor Library**: Using code editor library would allow users to be able to write code as if they were writing in VS Code. the library that was considers is Monaco Editor: https://microsoft.github.io/monaco-editor/. This editor allowed for users to get completions and errors in their note as well as basic syntax colorizarization based on the language worked with. This library often led to many bugs and difficulties in saving the content within the JSON note as well as the library would have bugs in appearing outside the note box instead of inside it. In addition deleting the code block also came with difficulties as when user clicked the add code block button it would appear and would need to create a separate button to get rid of the block.
 
* **Markdown Editor Library**: This is another library that was then considered which was the markdown library: https://github.com/Ionaru/easy-markdown-editor. This library would replace the text editor and allow user to add different styling such as adding bullet point and numerated elements. In addition the code editor separates the code from the rest of the note by adding a shaded region for differation. However this difference is very minimal which can be done without the library and also would eliminate the text box that is already built in the journal.
  
* **Code Block Styling Library**: Another library that was looked at was a code block styling library. This choice would be in reference to the markdown library where when code block button is pressed the user can write their code in a highlighted section and different font that would allow for a difference between text and code. Since there is no styling within the added code this following library was considered:https://highlightjs.org/. Due to time constarints, it was decided that time will not permit to explore adding this library to the current features and to avoid additional bugs or issues within the journal.



## Decision Outcome

* **Code Block**: We decided to implement a code block as briefly explained in the last option where users can add code within a highlighted region that seaparates their code with the text


Established flow: When users go to add code block button a black shaded region will appear with white font letters saying "Write your code here". Users will have the ability to now replace this with their own code as well as delete this block by simply deleting theit code. Users are able to continue to add more text under the block as well as add more block in the note. In addition the code block is able to be saved within the note json object.