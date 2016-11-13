
var pokerContainerClass = ".roundPContainer";
var pokerTableClass = ".roundPTable";
var pokerPlayerClass = "pplayer";
var pokerCardClass = "pcard";

var numOfPPlayers = 5;
var cardsPerPerson = 2; // Depending on the type of game (eg. 5 card poker)
var humanImage = "<img class=\"" + pokerPlayerClass + "\" src=\"images\\humanSymbol.jpeg\">";
var cardImage = "<img class=\"" + pokerCardClass + "\" src=\"images\\playing-card-back.jpg\">";

var currentDealer = 0;


$(document).ready(function(){ 
	setupTable();
});

$( window ).resize(function() {
	// Re-render everything
	setupTable();
});

function setupTable() {
	setupTableDimensions();
	setupPlayerAndCardLocs();
}

function cleanAllGraphics() {
	$(pokerContainerClass).children("img").remove();
	$(pokerTableClass).children().remove();
}

function setupPlayerAndCardLocs() {
	var tableContainer = $(pokerContainerClass);
	var tableOffset = tableContainer.offset();
	setupPlayers(tableContainer,tableOffset);
	setupCardLocs(tableContainer,tableOffset);
}

function setupCardLocs(tableContainer,tableOffset) {
	// Setup however many card images
	var templateImg = $("#hiddenData").children("."+pokerCardClass).first();
	var cardHeight = (tableContainer.height())/40;
	var cardWidth = (((cardHeight)/(templateImg.height())) * templateImg.width()); // maintain aspect ratio
	var overLapLowerLayer = (1/5)*cardWidth;
	
	offsetAmtArr = getOffsetAmts(overLapLowerLayer,cardWidth);
	// use offsetAmtArr[j]
	var cardLocArray = getCircularLocations(tableContainer,numOfPPlayers,-20,0);
	for(var i = 0; i < numOfPPlayers; i++) {
		var card = $(cardImage);
		card.height(cardHeight);
		tableContainer.append(card);
		setItemCenteredLoc(card,cardLocArray[i],tableOffset,cardHeight,cardWidth);
	}
}

function getOffsetAmts(overLapLowerLayer,cardWidth) {
	var result = [];
	var accumulatingShift = -1*overLapLowerLayer;
	for(var j = 0; j < cardsPerPerson; j++) {
		result.push(accumulatingShift);
		accumulatingShift+=(-1*overLapLowerLayer);
	}
	var totalWidth = (overLapLowerLayer*(cardsPerPerson-1))+cardWidth;
	
	// Now center it
	for(var j = 0; j < cardsPerPerson; j++) {
		result[j] = result[j]+(totalWidth/2)-(cardWidth/2);
	}
	return result;
}

function setupPlayers(tableContainer,tableOffset) {
	cleanAllGraphics();
	var templateImg = $("#hiddenData").children("."+pokerPlayerClass).first();
	var playerHeight = (tableContainer.height())/10;
	var playerWidth = (((playerHeight)/(templateImg.height())) * templateImg.width()); // maintain aspect ratio
	var locArray = getCircularLocations(tableContainer,numOfPPlayers,(playerHeight/2),0);
	for(var i = 0; i < numOfPPlayers; i++) {
		if(currentDealer == i) {
			// TODO: Something serious lol
		}
		var human = $(humanImage);
		human.height(playerHeight);
		tableContainer.append(human);
		setItemCenteredLoc(human,locArray[i],tableOffset,playerHeight,playerWidth);
	}
}

function setItemCenteredLoc(currentItem,loc,tableOffset,itemHeight,itemWidth) {
	currentItem.css("left",(loc.x-(itemWidth/2) - tableOffset.left));
	currentItem.css("top",(loc.y-(itemHeight/2) - tableOffset.top));
	currentItem.css("transform",("rotate(" + ((((-1*(loc.angle - ((Math.PI)/2))))/(2*(Math.PI)))*360) + "deg)"));
}

function getCircularLocations(tableContainer,numOfPPlayers,radiusOffset,rotaryOffset) {
	// I know there's probably some lib out there that can do shit but didn't wanna bother looking for one
	var result = [];
	var pTable = $(pokerTableClass);
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
	var tableContainer = $(pokerContainerClass);
	var pTable = $(pokerTableClass);
	pTable.height("70%");
	var finalDim = pTable.height();
	pTable.width(finalDim);
	var left = ((tableContainer.width())/2) - (finalDim/2);
	var top = ((tableContainer.height())/2) - (finalDim/2);
	pTable.css('left', left);
	pTable.css('top', top);
}