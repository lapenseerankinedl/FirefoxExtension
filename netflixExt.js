// This is the localStorage
var myStorage = window.localStorage;

function handleResponse(message) {
  console.log(`Message from the background script:  ${message.data}`);
}

function handleError(error) {
  console.log(error);
}

function notifyBackgroundPage(e) {
	var listOfVideos = myStorage.getItem("netflixList");
  var sending = browser.runtime.sendMessage({
    msg: 'Add',
		data: `${e}`
  });
  sending.then(handleResponse, handleError);
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
	var listOfVideos = myStorage.getItem("netflixList");
    if(request) {
        if (request.msg == "Sub") {
            // do cool things with the request then send response 
						
						// find the video
						
						var storedVideos = JSON.parse(listOfVideos);
						var count = storedVideos.length;
						var itemList = [];
						for(var i = 0; i < count; i++){
							var cur = storedVideos.pop();
							if (cur != request.data) {
								itemList.push(cur);
							}
						}
						myStorage.setItem("netflixList", JSON.stringify(itemList));
							
						// delete the video from netflixList
						
            console.log(`Message from the background script:  ${request.data}`);
            sendResponse({ msg: 'UpdateFromNetflix', data: `${listOfVideos}` }); // This response is sent to the message's sender, here the background script 
        }
				if (request.msg == "Update") {
						// send the list of videos
            console.log(`Message from the background script:  ${request.data}`);
            sendResponse({ data: `${listOfVideos}` }); // This response is sent to the message's sender, here the background script 
        }
    }
});


//This is the node that will be observed for mutations
const targetNode = document.getElementById('appMountPoint');

//These are the options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true};

function createButton() {
	let b = document.createElement('button');
	b.textContent = "B";
	b.id = 'blockTitle';
	return b;
}



//This is the Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
	for(const mutation of mutationsList) {
		if (mutation.type === 'childList') {

			var sliderList = document.getElementsByClassName('slider-refocus');
			
			var videoList = myStorage.getItem("netflixList");
			if (JSON.parse(videoList) != null) {
				for (var i=0; i < sliderList.length; i++) {
					var storedVideos = JSON.parse(videoList);
					var co = storedVideos.length;
					for( var j = 0; j < co; j ++) {
						var cur = storedVideos.pop();
						if (sliderList[i].getAttribute('aria-label') === cur
							&& !sliderList[i].hasAttribute('changed')) {
							sliderList[i].setAttribute('changed', 'true');
							
							// go up four parents and do style.display = "none";
							var gettingParent = sliderList[i];
							for(var k = 0; k < 4; k++) {
								gettingParent = gettingParent.parentElement;
							}
							gettingParent.style.display = "none";
						}
					}
				}
			}
			
			var bControls = document.getElementsByClassName('buttonControls--container');
			if (!bControls[0].hasAttribute('changed') 
				&& bControls[0].getAttribute("class") !='buttonControls--container mini-modal has-smaller-buttons'){
				bControls[0].setAttribute('changed', 'true');
				bControls[0].appendChild(createButton());
				bControls[0].addEventListener("click", function(e) {
					if(e.target && e.target.id == "blockTitle") {
						var prevSib = bControls[0].previousElementSibling;
						if (prevSib.getAttribute("title") == null) {
							prevSib = prevSib.previousElementSibling;
						}
						console.log("Button clicked " + prevSib.getAttribute("title"));
					
						var listOfVideos = myStorage.getItem("netflixList");
						console.log("video list: ");
						console.log(listOfVideos);
					
						if (JSON.parse(listOfVideos) == null) {
							var item = [];
							item.push(prevSib.getAttribute("title"));
							myStorage.setItem("netflixList", JSON.stringify(item));
							notifyBackgroundPage(prevSib.getAttribute("title"));
							listOfVideos = myStorage.getItem("netflixList");
							console.log("video list: " + JSON.parse(listOfVideos));
						}
						else {
							var storedVideos = JSON.parse(listOfVideos);
							var count = storedVideos.length;
							var found = false;
							var itemList = [];
							var name = prevSib.getAttribute("title");
							for(var i = 0; i < count; i++){
								var cur = storedVideos.pop();
								if (cur == name) {
									found = true;
								}
							}
							if(!found){
								var storedVideos = JSON.parse(listOfVideos);
								console.log("Videos stored: " + storedVideos);
								storedVideos.push(prevSib.getAttribute("title"));
								console.log("Videos stored: " + storedVideos);
								myStorage.setItem("netflixList", JSON.stringify(storedVideos));
								notifyBackgroundPage(prevSib.getAttribute("title"));
							}
						}
					}
				});
			}
		}//This line just tests out a different mutation
		else if (mutation.type === 'attributes') {
		}
	}
}

//Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

//Start observing the target node for configured mutations
observer.observe(targetNode, config);

//**********************************************************************************