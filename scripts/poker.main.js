
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
	var tableOffset = tableContainer.offset();
	var templateImg = $("#hiddenData").children(".pplayer").first();
	var playerHeight = (tableContainer.height())/10;
	var playerWidth = (((playerHeight)/(templateImg.height())) * templateImg.width()); // maintain aspect ratio
	var locArray = getAllHumansLocations(tableContainer,numOfPPlayers,(playerHeight/2));
	for(var i = 0; i < numOfPPlayers; i++) {
		if(currentDealer == i) {
			// TODO: Something serious lol
		}
		var human = $(humanImage);
		human.height(playerHeight);
		var currentHuman = tableContainer.append(human);
		setHumanCenteredLoc(human,locArray[i],tableOffset,playerHeight,playerWidth);
	}
}

function setHumanCenteredLoc(currentHuman,loc,tableOffset,playerHeight,playerWidth) {
	currentHuman.css("left",(loc.x-(playerWidth/2) - tableOffset.left));
	currentHuman.css("top",(loc.y-(playerHeight/2) - tableOffset.top));
	currentHuman.css("transform",("rotate(" + ((((-1*(loc.angle - ((Math.PI)/2))))/(2*(Math.PI)))*360) + "deg)"));
}

function getAllHumansLocations(tableContainer,numOfPPlayers,radiusOffset) {
	// I know there's probably some lib out there that can do shit but didn't wanna bother looking for one
	var result = [];
	var pTable = $(".roundPTable");
	var radius = ((pTable.width())/2) + radiusOffset;
	var currentAngle = (Math.PI)/2;
	var diffAngle = (2*(Math.PI))/numOfPPlayers;
	
	var lastCoord;
	for(var i = 0; i < numOfPPlayers; i++) {
		var currentCoord;
		// Set relative to circle center
		currentCoord = {x: (radius*(Math.cos(currentAngle))),y: (radius*(Math.sin(currentAngle))), angle: currentAngle};
		currentAngle-=diffAngle;
		
		// Adjust for table center
		currentCoord.x+=(pTable.width()/2 + pTable.offset().left);
		currentCoord.y= (-1*(currentCoord.y)) + ((pTable.height()/2) + pTable.offset().top);
		lastCoord = currentCoord;
		result.push(currentCoord);
	}
	
	return result;	
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