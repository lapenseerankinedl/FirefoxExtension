
var myStorage = window.localStorage;

function myFunction() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

//<input type="text" id="myInput" onkeyup="myFunction()" placeholder="Search for videos..">

function addButtons(){
	const section = document.getElementById('search');
	section.removeChild(section.firstChild);
	section.appendChild(createSearch());
	
	const videoList = document.getElementById('myTable');
	
	while (videoList.firstChild) {
		videoList.removeChild(videoList.firstChild);
	}
	

	var listOfVideos = myStorage.getItem("netflixList");
	
	if (JSON.parse(listOfVideos) != null) {
		var storedVideos = JSON.parse(listOfVideos);
		for (let video of storedVideos) {
			var tr = document.createElement('tr');
			var tdName = document.createElement('td');
			var tdButton = document.createElement('td');
			tdName.appendChild(createHeader(video));
			tdButton.appendChild(createButton(video));
			tr.appendChild(tdName);
			tr.appendChild(tdButton);
			videoList.appendChild(tr);
		}
	}
}

function createHeader(e) {
	let b = document.createElement('h6');
	b.textContent = `${e}`;
	b.id = `${e}`;
	return b;
}

function mouseDown(name) {
	var listOfVideos = myStorage.getItem("netflixList");
	var storedVideos = JSON.parse(listOfVideos);
	var count = storedVideos.length;
	var itemList = [];
	for(var i = 0; i < count; i++){
		var cur = storedVideos.pop();
		if (cur != name) {
			itemList.push(cur);
		}
	}
	myStorage.setItem("netflixList", JSON.stringify(itemList));
	addButtons();
	
	var sending = browser.runtime.sendMessage({
		msg: 'Sub',
		data: `${name}`
	});
	sending.then(handleResponse, handleError);
}

function createSearch() {
	let s = document.createElement('input');
	s.type = "text";
	s.id = "myInput";
	s.placeholder = 'Search for videos...';
	s.onkeyup = function() {myFunction();};
	return s;
}



function createButton(e) {
	let b = document.createElement('button');
	b.textContent = "unblock";
	b.name = `${e}`;
	b.id = 'unBlockTitle';
	b.onclick = function(){mouseDown(`${e}`);};
	return b;
}

function handleResponse(mess) {
	if(mess){		
		if(mess.data == "doneFromNetflix"){
			var listOfVideos = myStorage.getItem("netflixList");
		}
		else{ //(mess.msg == "UpdateFromNetflix") {
			var listOfVideos = myStorage.getItem("netflixList");
			
			if(JSON.parse(mess.data) != null){
				
				var storedVideos = JSON.parse(mess.data);
				var count = storedVideos.length;
				var item = [];
				for(var i = 0; i < count; i++){
					var cur = storedVideos.pop();
					item.push(cur);
				}
				myStorage.setItem("netflixList", JSON.stringify(item));
				listOfVideos = myStorage.getItem("netflixList");
			}
			addButtons();
		}
	}
}

function handleError(error) {
  console.log(error);
}


browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request) {
        if (request.msg == "Net") {
						
						var listOfVideos = myStorage.getItem("netflixList");
						console.log("video list: ");
						console.log(listOfVideos);
					
						if (JSON.parse(listOfVideos) == null) {
							var item = [];
							item.push(`${request.data}`);
							myStorage.setItem("netflixList", JSON.stringify(item));
							listOfVideos = myStorage.getItem("netflixList");
						}
						else {
							var storedVideos = JSON.parse(listOfVideos);
							storedVideos.push(`${request.data}`);
							myStorage.setItem("netflixList", JSON.stringify(storedVideos));
							listOfVideos = myStorage.getItem("netflixList");
						}
						
            sendResponse({ data: 'doneFromIndex' }); // This response is sent to the message's sender, here the background script 
        }
    }
});


var sending = browser.runtime.sendMessage({
		msg: 'Update',
		data: 'IndexToNetflix'
	});
sending.then(handleResponse, handleError);

addButtons();