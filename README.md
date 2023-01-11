# FirefoxExtension
A Firefox Extension for Enhancing Browsing Experience in Streaming Services

Allows a user to block and unblock specific videos from appearing while using the streaming services Netflix and Hulu

Stores a list of blocked videos using Browser Web Storage API, to allow for persisting data between login
sessions


Manifest.json file:
This is the file that tells your browser about your extension, labeled with keys:
Three keys that are mandatory: Manifest version, Extension name, and Version of the extension. The rest are optional.
Keys like description and icons are recommended to have, because they appear on the Addons-manager, helping distinguish your extension from others.
Content Scripts: The Javascript file(s) that has access to and interacts with the html web document. You get to specify which JavaScript files run on specific web pages.
Permissions: Asks for specific privileges from the browser, and for some permissions, the browser will ask the user if they want to grant them.
Browser_action: Adds a button in the browsers toolbar.
Background: Can access JavaScript APIs for WebExtensions, but can’t access web page content.


NetflixExt.js / NetflixExtHulu:
Uses MutationObserver to allow the addon to work when the website updates dynamically, not just when the website is first loaded.
It also sends and listens for messages from the background script, so it can send and receive data from other scripts.


Background.js:
The background script can access the WebExtension API’s, like browser_action, but it can’t access the content of web pages. So it acts like the mailman for the content scripts and the browser_action scripts. 
All it does is listen for messages, and when it gets a message, it sends it to the correct recipient, gets the response from that recipient, and sends that response to the original sender.


Index.php and IndexScript.js:
These files control what is shown in the popup menu that appears when you click on the toolbar button. 
Index.php is the file that has the base HTML for the popup and displays the list of videos, and IndexScript.js is the script file that communicates with Background.js, creates the list of videos, creates buttons to unblock videos, and has the search bar function.
