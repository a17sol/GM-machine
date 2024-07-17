### GM-machine
GM-machine is a tool to help GMs run DnD-like games, 
using Google Slides to keep character sheets visible to both GMs and players. 
The tool automates round countdowns for timed effects during combat, 
and allows real-time timers to be set to simulate rushed decision making.

### Installation
First of all, prepare a presentation.
1. Copy the presentation template from the link: 
https://docs.google.com/presentation/d/1zHa5-70QTQsXFc5z6VSd87qaBktKY3hhJjlS1Lzud6o/edit?usp=sharing 
(File > Make a copy > Entire presentation). 
2. Duplicate the character sheet template as many times as you need and fill it out. 
In addition, the presentation should include a Summary slide that will give a brief summary of all the effects in effect. 
3. At the end of the presentation there is a special Table of Contents text box. 
Insert the list of pages on which the temporary effects of each character are to be displayed, 
and specify the page number of the Summary page. The text box itself can be moved to any slide or modified, 
but do not delete it, as the script recognises it by its unique invisible label. 
All other elements of the presentation can be customized according to your needs.

The script is copied along with the presentation, you only need to set a trigger.

1. With your presentation open select Extensions > Apps Script.
2. In the leftmost menu select Triggers and click "Add trigger".
Change only two fields: Function - updateTimerText and Type of the trigger - Minutes timer.
Save it to complete the installation.

### Usage
To run the script, refresh the presentation page and select Extensions > GM-machine > Open panel.
A control panel will appear, allowing you to add and remove counters, timers and stopwatches (clocks). 
Each item is added to both the Summary page and the character page, with the exception of NPC items.
Step counters button steps down all the counters in the presentation, counters disappear when they reach zero.

On the first run Google will ask you to give the script the necessary permissions to modify your presentation.
Do this by clicking on the smallest letters at the bottom of the window.