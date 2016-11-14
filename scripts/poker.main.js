
var pokerContainerClass = ".roundPContainer";
var pokerTableClass = ".roundPTable";
var pokerPlayerClass = "pplayer";
var pokerCardClass = "pcard";

var numOfPPlayers = 5;
var cardsPerPerson = 2; // Depending on the type of game (eg. 5 card poker)
var humanImage = "<img class=\"" + pokerPlayerClass + "\" src=\"images\\humanSymbol.jpeg\">";
var cardImage = "<img class=\"" + pokerCardClass + "\" src=\"images\\playing-card-back.jpg\">";

// Just a template, DON'T ASSIGN A VALUE FOOL!
// TODO: Remove below and get Ajax (or Pickering) working :P
var cardAnimTemplate = "\n.{className}\n{\n	-webkit-animation:{keyFrameName} 2s infinite; /* Chrome, Safari, Opera */\n	animation:{keyFrameName} 2s;\n	animation-iteration-count: 1;\n	animation-fill-mode:forwards;\n animation-timing-function: ease-out;}\n\n/* Chrome, Safari, Opera */\n@-webkit-keyframes {keyFrameName}\n{\n	0%   { left:{initialPosLeft}; top:{initialPosTop};-webkit-transform:rotate({initialPosDeg})}\n	100% {left:{finalPosLeft}; top:{finalPosTop};-webkit-transform:rotate({finalPosDeg})}\n}\n\n/* Standard syntax */\n@keyframes {keyFrameName}\n{\n	0%   { left:{initialPosLeft}; top:{initialPosTop};transform:rotate({initialPosDeg})}\n	100% {left:{finalPosLeft}; top:{finalPosTop};transform:rotate({finalPosDeg})}\n}";

var customStyleNode = undefined;

var currentDealer = 3;


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
	setupCards(tableContainer,tableOffset);
}

function setupCards(tableContainer,tableOffset) {
	if(cardAnimTemplate === undefined) {
		// Load card animation template
		$.get( "styles/cardAnimationTemplate.hss", function( data ) {
			cardAnimTemplate = data;
			console.log( cardAnimTemplate ); // TODO: Remove
			setupCardLocs(tableContainer,tableOffset);
		});
	} else {
		setupCardLocs(tableContainer,tableOffset);
	}
}

function setupCardLocs(tableContainer,tableOffset) {
	
	// Setup however many card images
	var templateImg = $("#hiddenData").children("."+pokerCardClass).first();
	var cardHeight = (tableContainer.height())/40;
	var cardWidth = (((cardHeight)/(templateImg.height())) * templateImg.width()); // maintain aspect ratio
	var overLapLowerLayer = (1/5)*cardWidth;
	var uniqueCardAnimId = 1;
	
	offsetAmtArr = getOffsetAmts(overLapLowerLayer,cardWidth);
	
	var dealerCardLocArray = getCircularLocations(tableContainer,numOfPPlayers,(-30-cardHeight),0);
	var dealerDeckLoc = dealerCardLocArray[currentDealer];
	
	for(var j = 0; j < cardsPerPerson; j++) {
		var cardLocArray = getCircularLocations(tableContainer,numOfPPlayers,-20,offsetAmtArr[j]);
		for(var i = 0; i < numOfPPlayers; i++) {
			var card = $(cardImage);
			card.height(cardHeight);
			tableContainer.append(card);
			setItemCenteredLoc(card,dealerDeckLoc,tableOffset,cardHeight,cardWidth);
			
			// TODO: Disable re-dealing when window resized
			// Animate from Dealer to Dealee
			var clsName = "cardanim" + uniqueCardAnimId;
			var customTemplate = buildUniqueAnim(clsName,uniqueCardAnimId,dealerDeckLoc,cardLocArray[i],tableOffset,cardHeight,cardWidth);
			uniqueCardAnimId++;
			appendCSSSection(customTemplate);
			
			// Apply clsName to newly created element starting the animation
			card.toggleClass(clsName);
		}
	}
}

function buildUniqueAnim(clsName, uniqueId, startLoc, endLoc,tableOffset,cardHeight,cardWidth) {
	var customAnimTemplate = cardAnimTemplate;
	var uniqueKeyFrame = "cardAnimKF" + uniqueId;
	
	customAnimTemplate = customAnimTemplate.replace(/\{className\}/g, clsName);
	customAnimTemplate = customAnimTemplate.replace(/\{keyFrameName\}/g, uniqueKeyFrame);
	customAnimTemplate = customAnimTemplate.replace(/\{initialPosLeft\}/g, getTableWiseLeft(startLoc,cardWidth,tableOffset)+"px");
	customAnimTemplate = customAnimTemplate.replace(/\{initialPosTop\}/g, getTableWiseTop(startLoc,cardHeight,tableOffset)+"px");
	customAnimTemplate = customAnimTemplate.replace(/\{initialPosDeg\}/g, getTableWiseRot(startLoc));
	customAnimTemplate = customAnimTemplate.replace(/\{finalPosLeft\}/g, getTableWiseLeft(endLoc,cardWidth,tableOffset)+"px");
	customAnimTemplate = customAnimTemplate.replace(/\{finalPosTop\}/g, getTableWiseTop(endLoc,cardHeight,tableOffset)+"px");
	customAnimTemplate = customAnimTemplate.replace(/\{finalPosDeg\}/g, getTableWiseRot(endLoc));
	
	return customAnimTemplate;
}

function appendCSSSection(cssText){
	if(customStyleNode === undefined) {
		buildCustomCSSSection();
	}
	
	customStyleNode.innerHTML += cssText;
}

function buildCustomCSSSection() {
	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = ' ';
	document.getElementsByTagName('head')[0].appendChild(style);
	customStyleNode = style;
	
}


function getTableWiseLeft(loc,itemWidth,tableOffset) {
	return (loc.x-(itemWidth/2) - tableOffset.left);
}

function getTableWiseTop(loc,itemHeight,tableOffset) {
	return (loc.y-(itemHeight/2) - tableOffset.top);
}
function getTableWiseRot(loc) {
	return ((((-1*(loc.angle - ((Math.PI)/2))))/(2*(Math.PI)))*360) + "deg";
}

function getOffsetAmts(overLapLowerLayer,cardWidth) {
	var result = [];
	result[0]=0;
	var accumulatingShift = -1*overLapLowerLayer;
	for(var j = 1; j < cardsPerPerson; j++) {
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
	currentItem.css("left",getTableWiseLeft(loc,itemWidth,tableOffset));
	currentItem.css("top",getTableWiseTop(loc,itemHeight,tableOffset));
	currentItem.css("transform",("rotate(" + getTableWiseRot(loc) + ")"));
}

function getCircularLocations(tableContainer,numOfPPlayers,radiusOffset,rotaryOffset) {
	// I know there's probably some lib out there that can do shit but didn't wanna bother looking for one
	var result = [];
	var pTable = $(pokerTableClass);
	var radius = ((pTable.width())/2) + radiusOffset;
	var currentAngle = (Math.PI)/2;
	var diffAngle = (2*(Math.PI))/numOfPPlayers;
	
	if(rotaryOffset != 0) {
		var diff = Math.abs(rotaryOffset);
		var angleDiff = Math.acos((1-((Math.pow(diff,2))/(2*(Math.pow(radius,2))))));
		// Positive/Negative offset
		if(rotaryOffset > 0) {
			currentAngle+=angleDiff;
		} else {
			currentAngle-=angleDiff;
		}
	}
	
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