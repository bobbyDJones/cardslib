
var pokerContainerClass = ".roundPContainer";
var pokerTableClass = ".roundPTable";
var pokerPlayerClass = "pplayer";
var pokerCardClass = "pcard";
var deckCardCls = "deckCard";
var communityPadderCls = ".communityPadder";
var communityHelperCls = ".communityHelper";
var commCardCell = "#commCell";

var numOfPPlayers = 5;
var cardsPerPerson = 2; // Depending on the type of game (eg. 5 card poker)
var humanImage = "<img class=\"" + pokerPlayerClass + "\" src=\"images\\humanSymbol.jpeg\">";
var cardImage = "<img class=\"" + pokerCardClass + "\" src=\"images\\playing-card-back.jpg\">";
var uniqueCardAnimId = 1;
// Just a template, DON'T ASSIGN A VALUE FOOL!
// TODO: Remove below and get Ajax (or Pickering) working :P
var cardAnimTemplate = "\n.{className}\n{\n	-webkit-animation:{keyFrameName} 2s infinite; /* Chrome, Safari, Opera */\n	animation:{keyFrameName} 2s;\n	animation-iteration-count: 1;\n	animation-fill-mode:forwards;\n animation-timing-function: ease-out;}\n\n/* Chrome, Safari, Opera */\n@-webkit-keyframes {keyFrameName}\n{\n	0%   { left:{initialPosLeft}; top:{initialPosTop};-webkit-transform:rotate({initialPosDeg})}\n	100% {left:{finalPosLeft}; top:{finalPosTop};-webkit-transform:rotate({finalPosDeg})}\n}\n\n/* Standard syntax */\n@keyframes {keyFrameName}\n{\n	0%   { left:{initialPosLeft}; top:{initialPosTop};transform:rotate({initialPosDeg})}\n	100% {left:{finalPosLeft}; top:{finalPosTop};transform:rotate({finalPosDeg})}\n}";

var customStyleNode = undefined;

var interCardDealSpeed = 1000; // Could vary depending on how fast the dealer deals out the cards. I would be a much higher number ;)
var currentDealer = 0;
var cardsDealt = false;
var stateConstants = {PreDeal: "PreDeal" /* Not used */, PreFlop: "PreFlop", PostDeal: {Flop: "Flop", Turn: "Turn", River: "River", End: "End"}}; // Dunno better way to do enums in javascript, suggestions?
var generalState = stateConstants.PreDeal;
var postDealState = undefined;
var cardHeight;
var cardWidth;
var tableOffset = undefined;
var finalPTableDim = undefined;

$(document).ready(function(){ 
	setupTable();
});

$( window ).resize(function() {
	// Re-render everything
	setupTable();
});

$( window ).click(function(){
	// TODO: Start with betting, server resp., etc.
	//doNextAction();
});

function doNextAction() {
	switch(generalState) {
		case stateConstants.PreDeal:
			if(cardsDealt) {
				generalState = stateConstants.PreFlop;
				dealToCommunity(3);
			}
			break;
		case stateConstants.PreFlop:
			generalState = stateConstants.PostDeal;
			dealToCommunity(1);
			break;
		case stateConstants.PostDeal:
			dealToCommunity(1);
			break;
		default:
	}
}

function dealToCommunity(cardsToDeal) {
	var deckCardImg = $("."+deckCardCls);
	
	for(var dealIdx = 0; dealIdx<cardsToDeal; dealIdx++) {
		var flippedCard = flipOverCard(deckCardImg);
	}
}

function flipOverCard(deckCardObj) {
	var newCard = deckCardObj.clone();
	setCommCardStyles(newCard);
	$(communityPadderCls).append(newCard);
	
	//var clsName = buildCardAnimation(dealerDeckLoc,cardLocArray[playerIdx],tableOffset);
	return newCard;
}

function setCommCardStyles(newCard) {
	newCard.removeClass();
	newCard.toggleClass('communityDeckCard');
	newCard.attr('style', '');
	newCard.height(cardHeight);
	newCard.css('max-height',finalPTableDim+"px");
	newCard.css('max-width',finalPTableDim+"px");
	newCard.css('padding-left',(cardWidth*0.3)+"px");
}


function setupTable() {
	setupTableDimensions();
	setupPlayerAndCardLocs();
}

function cleanAllGraphics() {
	$(pokerContainerClass).children("img").remove();
	//$(pokerTableClass).children().remove();
}

function setupPlayerAndCardLocs() {
	var tableContainer = $(pokerContainerClass);
	tableOffset = tableContainer.offset();
	setupPlayers(tableContainer,tableOffset);
	setupCards(tableContainer,tableOffset);
}

function setupCards(tableContainer,tableOffset) {
	var templateImg = $("#hiddenData").children("."+pokerCardClass).first();
	cardHeight = (tableContainer.height())/30;
	cardWidth = (((cardHeight)/(templateImg.height())) * templateImg.width()); // maintain aspect ratio
	//$(communityHelperCls).css('margin-left',(-1*cardHeight)); // Dunno why but the community group always starts after contrary to example, weird...
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
	var overLapLowerLayer = (1/5)*cardWidth;
	
	
	offsetAmtArr = getOffsetAmts(overLapLowerLayer,cardWidth);
	
	var dealerCardLocArray = getCircularLocations(tableContainer,numOfPPlayers,(-30-cardHeight),0);
	var dealerDeckLoc = dealerCardLocArray[currentDealer];
	
	var cardClassMaps = [];
	
	// TODO: Remove below if not dealing:
	cardsDealt = false;
	var deckCard = $(cardImage);
	deckCard.height(cardHeight);
	tableContainer.append(deckCard);
	setItemCenteredLoc(deckCard,dealerDeckLoc,tableOffset,cardHeight,cardWidth);
	deckCard.toggleClass(deckCardCls);
	
	for(var j = 0; j < cardsPerPerson; j++) {
		var cardLocArray = getCircularLocations(tableContainer,numOfPPlayers,-20,offsetAmtArr[j]);
		// TODO: Remove below if not dealing:
		var playerIdx = (currentDealer+1)%numOfPPlayers;
		
		for(var i = 0; i < numOfPPlayers; i++) {
			var card = $(cardImage);
			card.height(cardHeight);
			tableContainer.append(card);
			setItemCenteredLoc(card,dealerDeckLoc,tableOffset,cardHeight,cardWidth);
			
			// TODO: Disable re-dealing when window resized
			// Animate from Dealer to Dealee
			clsName = buildCardAnimation(dealerDeckLoc,cardLocArray[playerIdx],tableOffset);
			playerIdx = (playerIdx+1)%numOfPPlayers;
			
			// Apply clsName to newly created element starting the animation
			cardClassMaps.push({"cardObj" : card, "animCls" : clsName});
		}
	}
	
	if(cardClassMaps.length > 0) {
		startDealing(0,cardClassMaps,cardClassMaps.length-1);
	}
	
}

function buildCardAnimation(startLoc,endLoc,tableOffset) {
	var clsName = "cardanim" + uniqueCardAnimId;
	var customTemplate = buildUniqueAnim(clsName,uniqueCardAnimId,startLoc,endLoc,tableOffset);
	uniqueCardAnimId++;
	appendCSSSection(customTemplate);
	return clsName;
}

/*function setupCardContainers(totalNumOfCards) {
	var commCell = $(commCardCell);
	var commCellHeight;
	var commCellWidth;
	var paddingFactor = 0.3;
	
	if((cardHeight !== undefined) && (cardWidth !== undefined)) {
		var heightMargin = paddingFactor*cardHeight;
		var widthMargin = paddingFactor*cardWidth;
		
		commCellHeight = cardHeight;
		commCellWidth = totalNumOfCards*cardWidth + ((totalNumOfCards-1)*widthMargin);
		
		commCell.height(commCellHeight);
		commCell.width(commCellWidth);
		marginVertical(commCell,heightMargin);
		marginHorizontal(commCell,widthMargin);
	}
	
}

function marginVertical(el,padAmount) {
	el.css('margin-top',padAmount);
	el.css('margin-bottom',padAmount);
}

function marginHorizontal(el,padAmount) {
	el.css('margin-left',padAmount);
	el.css('margin-right',padAmount);
}*/

function startDealing(idx,cardClassMaps,lastIdx) {
	var card = cardClassMaps[idx]["cardObj"];
	var clsName = cardClassMaps[idx]["animCls"];
	card.toggleClass(clsName);
	if(idx != lastIdx) {
		setTimeout(function(){
			startDealing((idx+1),cardClassMaps,lastIdx);
		}, interCardDealSpeed);
	} else {
		cardsDealt = true;
	}
}

function buildUniqueAnim(clsName, uniqueId, startLoc, endLoc,tableOffset) {
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
	finalPTableDim = pTable.height();
	pTable.width(finalPTableDim);
	var left = ((tableContainer.width())/2) - (finalPTableDim/2);
	var top = ((tableContainer.height())/2) - (finalPTableDim/2);
	pTable.css('left', left);
	pTable.css('top', top);
	$(communityPadderCls).height(finalPTableDim);
	$(communityPadderCls).width(finalPTableDim);
	
}