// this is the background script

var mess="";


browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.msg == "Sub") {
      browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // relay indexScript.js's message to netflixExt.js
        browser.tabs.sendMessage(tabs[0].id, request, (response) => {
          if (response) {
            if (response.data) {
              // relay netflixExt.js's response to indexScript.js
              sendResponse({ data: response.data });
            }
          }
        });
      });
    }
		
		if (request.msg == "Update") {
      browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // relay indexScript.js's message to netflixExt.js
        browser.tabs.sendMessage(tabs[0].id, request, (response) => {
          if (response) {
            if (response.data) {
              // relay netflixExt.js's response to indexScript.js
              sendResponse({ data: response.data });
            }
          }
        });
      });
    }
		
		if (request.msg === "Add") {
			// relay netflixExt.js's message to indexScript.js
			
			browser.runtime.sendMessage({ msg: "Net", data: request.data }, (response) => {
				if (response) {
					if (response.data) {
						// relay indexScript.js's response to NetflixExt.js
						sendResponse({ data: response.data });
					}
				}
				else {
					// Right now this does nothing, because I cannot get database to work
				}
			});
    }
    return true; // Required to keep message port open
});