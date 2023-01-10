// This is the localStorage
var myStorage = window.localStorage;

function handleResponse(message) {
  console.log(`Message from the background script:  ${message.data}`);
}

function handleError(error) {
  console.log(error);
}

function notifyBackgroundPage(e) {
	var listOfVideos = myStorage.getItem("netflixListHulu");
  var sending = browser.runtime.sendMessage({
    msg: 'Add',
		data: `${e}`
  });
  sending.then(handleResponse, handleError);
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
	var listOfVideos = myStorage.getItem("netflixListHulu");
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
						myStorage.setItem("netflixListHulu", JSON.stringify(itemList));
							
						// delete the video from netflixListHulu
												
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
const targetNode = document.getElementById('__next');

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
			
			var sliderList = document.getElementsByClassName('WindowedListItem cu-windowedlistitem-visible');
			
			
			
			var videoList = myStorage.getItem("netflixListHulu");
			if (JSON.parse(videoList) != null) {
				for (var i=0; i < sliderList.length; i++) {
					
					var storedVideos = JSON.parse(videoList);
					var co = storedVideos.length;
					for( var j = 0; j < co; j ++) {
						var gettingChild = sliderList[i];
						gettingChild = gettingChild.firstChild;
						if (gettingChild.getAttribute('class') === "SimpleSliderCollection__item" ||
								gettingChild.getAttribute('class') === "StandardSliderCollectionSimple__item"){
						
							
							for (var k = 0; k < 7; k++){
								gettingChild = gettingChild.firstChild;
							}
							console.log(gettingChild.getAttribute('class'));
							gettingChild = gettingChild.firstChild;
							gettingChild = gettingChild.firstChild;
							gettingChild = gettingChild.nextSibling;
							console.log(gettingChild.getAttribute('class'));
								
							var cur = "Cover art for " + storedVideos.pop() + ".";
							if (gettingChild.getAttribute('alt') === cur 
									&& !sliderList[i].hasAttribute('changed')){
								sliderList[i].setAttribute('changed', 'true');
								sliderList[i].style.display = "none";
							}
							
						}
					}
				}
			}
			
			///*
			var bControls = document.getElementsByClassName('ActionMenu');
			if (!bControls[0].hasAttribute('changed')){
				bControls[0].setAttribute('changed', 'true');
				bControls[0].appendChild(createButton());
				bControls[0].addEventListener("click", function(e) {
					if(e.target && e.target.id == "blockTitle") {
						// go up a parent
						var gettingParent = bControls[0].parentElement;
						// get previous sibling 3 times
						var prevSib = gettingParent.previousElementSibling;
						prevSib = prevSib.previousElementSibling;
						prevSib = prevSib.previousElementSibling;
						// get child 
						prevSib = prevSib.firstChild;
						var titleName = '';
						if (prevSib.getAttribute("alt") == null) {
							titleName = prevSib.textContent;
						}
						else{
							titleName = prevSib.getAttribute("alt");
						}
						var listOfVideos = myStorage.getItem("netflixListHulu");
						console.log("Button clicked " + titleName);
						console.log("video list: ");
						console.log(listOfVideos);
						if (JSON.parse(listOfVideos) == null) {
							var item = [];
							item.push(titleName);
							myStorage.setItem("netflixListHulu", JSON.stringify(item));
							console.log(titleName);
							notifyBackgroundPage(titleName);
							listOfVideos = myStorage.getItem("netflixListHulu");
							console.log("video list: " + JSON.parse(listOfVideos));
						}
						else {
							var storedVideos = JSON.parse(listOfVideos);
							var count = storedVideos.length;
							var found = false;
							var itemList = [];
							var name = titleName;
							for(var i = 0; i < count; i++){
								var cur = storedVideos.pop();
								if (cur == name) {
									found = true;
								}
							}
							if(!found){
								var storedVideos = JSON.parse(listOfVideos);
								console.log("Videos stored: " + storedVideos);
								storedVideos.push(titleName);
								console.log("Videos stored: " + storedVideos);
								myStorage.setItem("netflixListHulu", JSON.stringify(storedVideos));
								console.log(titleName);
								notifyBackgroundPage(titleName);
							}
						}
						
					}
				});
			}//*/
		}//This line just tests out a different mutation
		else if (mutation.type === 'attributes') {
		}
	}
}

//Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

//Start observing the target node for configured mutations
observer.observe(targetNode, config);

function populateStorage() {
	localStorage.setItem();
}

//**********************************************************************************