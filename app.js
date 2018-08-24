
var eventFeatureAdded = [];

var allEvtData = [];
var local;
var display;
function searchEvent(myLayer)
{
	var btn = document.querySelector("#updateEvent");
	btn.disabled = true;
	var customData = document.getElementById('customData').value;
	if((customData =="") ||(customData =="Country")){
		customData = "DE";
	}
	
	//btn.className += "button5";
    var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200){
        console.log(xhttp);
		parseResponse(xhttp.responseText,myLayer);
    }
	};
	xhttp.open("GET", "https://api.predicthq.com/v1/events/?country="+customData+"&limit=30", true);
	xhttp.setRequestHeader('Authorization', 'Bearer o1opPDllv5uVk4QaTgIjOxoKOJMWmP');
	xhttp.setRequestHeader('Accept', 'application/json');
	xhttp.send();
}

function parseResponse(response,myLayer){
    //console.log(e);
    //console.log(response);
	var srcRes = JSON.parse(response);
	console.log(srcRes);
	console.log(srcRes.count);
	var events = srcRes["results"];
	var infoEvent = document.querySelector("#info");
	infoEvent.innerText = "";
	var i = 1;
	events.forEach(element => {
        console.log(element["location"]);
		addEventMarker(element,myLayer, element["location"]);
		getEventDetails(element,i);
		i++;
    });
	document.querySelector("#resetSel").style.display = "block";
	document.querySelector("#Tip").style.display = "none";
	document.querySelector("#customData").style.display = "none";
	myLayer.setZoomlevel(2,3000);
	infoEvent.style.display = "block";
	
}

function addEventMarker(element,myLayer,loc){
	local = myLayer.getLayers(1);
	var fea = local.addFeature({
		geometry: {
			coordinates: [loc[0], loc[1]],
			type: "Point"
		},
		properties: {
			"info":  element["title"]
		},
		type: "Feature",
	});
	eventFeatureAdded.push(fea);
}

function getEventDetails(event,i){
	var infoEvent = document.querySelector("#info");
	infoEvent.innerText = infoEvent.innerText + "\n" + i +". " + event["title"] + "\n" + "Event Type : " + event["category"].toUpperCase() + "\n"  + event["start"] + "\n";
}

function resetSelection(){
	var infoEvent = document.querySelector("#info");
	infoEvent.innerText = "";
	infoEvent.style.display = "none";
	eventFeatureAdded.forEach(element => {
		local.removeFeature(element);
    });
	var btn = document.querySelector("#updateEvent");
	btn.disabled = false;
	document.querySelector("#resetSel").style.display = "none";
	document.querySelector("#customData").style.display = "block";
	document.querySelector("#customData").value = "";
	document.querySelector("#Tip").style.display = "block";
	document.querySelector("#eventInfo").style.display = "none";
	display.setZoomlevel(10,1000);
}

function eventHandlerPtrUp(evt){
	 var currFeature = evt.target;
  if((currFeature) && (currFeature.geometry.type == "Point")){
	  console.log(currFeature.properties.info);
	  document.querySelector("#eventInfo").innerText = currFeature.properties.info;
	  document.querySelector("#eventInfo").style.display = "block";
  }
}

