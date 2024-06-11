# ADR - Tag Color Implementation

## Context and Problem Statement

Having colored tags was something that we had from the beginning in our design of the Dev Journal. Colors allow for readabilility and customization.

## Considered Options 
The color wheel was our first choice at the start of the sprint. 
* **Color Wheel**: To mimic successful UI designs for color pickers so that users are willing to use our Dev Journal. This is reinforcing the idea of the 99% rule. However, after researching and watching tutorials, I found that creating a circle, a color gradient, and a rainbow of colors required an external library.  We did not continue with this option because we did not want to introduce too many dependencies.

* **Linear arrangement of colored buttons**: This is another commonly used UI. The idea was the implement a button.  Clicking the button would trigger a pop up that would allow you to choose from a limited selection of colors.  Limitations in colors would be implemented in order to decrease complexity and keep things simple for users and developers. Similar to implementing the color wheel, setting up a box for colored buttons, using vanilla HTML, CSS, and JS would take too long - for rendering buttons or circles, extra styling, and more. 
  
* **Default HTML color picker**: Upon searching for other color picker implementations, we realized that found HTML has its own color picker. It is a type of ```<input>``` that required reading extensive documentation and there were too many colors to choose from.  It introduces unnecessary complexity and choices for users that will make them indecisive.

* **Modal implementation**: Using a modal is similar to having an alert. After reading documentation and tutorials, we thought about the workflow and found that a modal acts like alert.  It makes the user solely focus on picking a color.  In addition, we would have to understand extensive documentation in order to input a type of color picker within the modal (pop-up). 




## Decision Outcome

* **Dropdown Selection**: We decided to implement a dropdown of a list of tag colors to choose from because dropdowns are familiar to developers and the workflow and design is simple for users to use. 


Established flow: When users go to choose a tag color, they have 6 colors to choose from.  Once they select a color from the dropdown, the ```create tag``` input box will change to reflect the selected color. Once the user finishes creating the tag, they click the ```+``` button and a colored tag is created!
