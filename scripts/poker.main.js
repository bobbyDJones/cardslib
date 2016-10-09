
var numOfPPlayers = 5;
var humanImage = "<img class=\"pplayer\" src=\"images\\humanSymbol.jpeg\">";

var currentDealer = 0;


$(document).ready(function(){ 
	setupTable();
});

function setupTable() {
	setupTableDimensions();
	setupPlayers();
}

function setupPlayers() {
	var tableContainer = $(".roundPContainer");
	var locArray = getAllHumansLocations(tableContainer,numOfPPlayers);
	for(var i = 0; i < numOfPPlayers; i++) {
		if(currentDealer == i) {
			// TODO: Something serious lol
		}
		var human = $(humanImage);
		var currentHuman = tableContainer.append(human);
		setHumanCenteredLoc(human,locArray[i]);
	}
}

function setHumanCenteredLoc(currentHuman,loc) {
	currentHuman.css("left",(loc.x-((currentHuman.width())/2)));
	currentHuman.css("top",(loc.y-((currentHuman.height())/2)));
}

function getAllHumansLocations(tableContainer,numOfPPlayers) {
	// I know there's probably some lib out there that can do shit but didn't wanna bother looking for one
	var result = [];
	var pTable = $(".roundPTable");
	var circumference = Math.PI*(pTable.width());
	var circularDiffs = circumference/numOfPPlayers;
	
	var lastCoord;
	for(var i = 0; i < numOfPPlayers; i++) {
		var currentCoord;
		if(i == 0) {
			currentCoord = {x: ((tableContainer.width())/2),y: (pTable.position().top) angle: 0};
		} else {
			//currentCoord = getCircularCoords(lastCoord,circularDiffs,pTable.width()/2,(2*Math.PI)/numOfPPlayers);
		}
		lastCoord = currentCoord;
		result.push(currentCoord);
	}
	
	return result;	
}

function getCircularCoords(lastCoord,circularDiffs,radius,angle) {
	var newCoord;
	var equalAngles = (Math.PI-angle)/2;
	var lineLength = ((radius/(Math.sin(equalAngles)))*(Math.sin(angle)));
	return newCoord;
}

function setupTableDimensions() {
	var tableContainer = $(".roundPContainer");
	var pTable = $(".roundPTable");
	pTable.height("70%");
	var finalDim = pTable.height();
	pTable.width(finalDim);
	var left = ((tableContainer.width())/2) - (finalDim/2);
	var top = ((tableContainer.height())/2) - (finalDim/2);
	pTable.css('left', left);
	pTable.css('top', top);
}