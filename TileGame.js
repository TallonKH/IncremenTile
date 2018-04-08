let mainFlex = document.getElementById("main-flex");
let canvas = document.getElementById("grid-canvas");
let ctx = canvas.getContext("2d");
let matListDiv = document.getElementById("list-materials");
let currentWorld = null;

let mouseDown = false;
let canvasSize = 100;
let mouseDownPos = new Point(0, 0);
let currentMousePos = new Point(0, 0);
let lastMousePos = new Point(0, 0);
let totalMouseDelta = new Point(0, 0);
let mouseDownCaught = false;
let viewportPos = new Point(0, 0);
let isMouseDragging = false;
let viewportScale = 1;
let zoomCounter = 0;
let zoomAmount = 1; // change this to manually zoom in/out
let zoom = 1; // DO NOT CHANGE THIS
let dim = 1;
let placing = null;

let longRefreshCounter = 0;
let longRefreshInterval = 10;
let secondCounter = 0;
let ticksPerSecond = 1000 / 30;
let secondsOverflowCounter = 0;

let tileTypes;
let materialTypes;
let matList;
let lockedMats;
let recipes;
let TAU = Math.PI * 2;

function main() {
	tileTypes = generateTileTypes();
	materialTypes = generateMaterialTypes();
	matList = Object.values(materialTypes);
	lockedMats = Object.keys(materialTypes);
	recipes = interpretRecipes();
	intialAccordions();
	interpretRecipes();
	unlockMaterialPanels();

	currentWorld = new World(0, "White Void");
	aGrid = new Grid(new Point(9, 9));
	aGrid.pos = new Point(5, 5);
	currentWorld.enter(aGrid);
	fixScreenDims();
	console.log(currentWorld);
	maintainServerLoop();
}

function serverTick(skippedTicks) {
	longRefreshCounter += skippedTicks;
	currentWorld.onTick(skippedTicks);
	if(longRefreshCounter > longRefreshInterval){
		longRefresh();
		longRefreshCounter = 0;
	}

	Material.prototype.updateAllDetails();
	redraw();
}

// calls every 10 ticks or so... not precise
function longRefresh(){
	unlockMaterialPanels();
}

// ticks every second
function secondTick(skippedSeconds){
	for (var i = 0; i < matList.length; i++) {
		let mat = matList[i];
		mat.updateStats(skippedSeconds);
	}
}

function maintainServerLoop() {
	var currentTime = Date.now();
	var lastTime = currentTime;
	var deltaTime = 0; //30 times a second
	var deltaTime2 = 0; //once a second

	function requestNext() {
		window.requestAnimationFrame(serverLoopIteration);
	};

	function serverLoopIteration() {
		currentTime = Date.now();

		deltaTime += currentTime - lastTime;
		if (deltaTime > ticksPerSecond) {
			serverTick(Math.floor(deltaTime / ticksPerSecond));
			requestNext();
			deltaTime = deltaTime % ticksPerSecond;
		} else {
			setTimeout(requestNext, ticksPerSecond - deltaTime);
		}

		deltaTime2 += currentTime - lastTime;
		if(deltaTime2 > 1000){
			secondTick(Math.floor(deltaTime2 / 1000));
			deltaTime2 = deltaTime2 % 1000;
		}

		lastTime = currentTime;
	}

	serverLoopIteration();
}

function redraw() {
	zoom = zoomAmount * canvasSize / 100;
	currentWorld.draw(viewportPos, zoom);
}

function intialAccordions() {
	var acc = document.getElementsByClassName("accordion");
	var i;
	for (i = 0; i < acc.length; i++) {
		addAccordionLogic(acc[i]);
	}
}

function addAccordionLogic(div) {
	div.addEventListener("click", function() {
		var panel = this.nextElementSibling;
		if (this.hasAttribute("open")) {
			this.removeAttribute("open");
			panel.removeAttribute("open");
		} else {
			this.setAttribute("open", true);
			panel.setAttribute("open", true);
		}
		if(this.hasAttribute("new")){
			this.removeAttribute("new");
		}
	});
}

function unlockMaterialPanels() {
	let unlocked = [];
	for (let i = 0; i < lockedMats.length; i++) {
		let mat = materialTypes[lockedMats[i]];
		let percent = 1;
		for (var j = 0; j < mat.recipe.length; j++) {
			let ingredient = mat.recipe[j];
			percent = Math.min(percent, ingredient[0].counter / ingredient[1]);
		}

		if(percent >= mat.unlockPercentage){
			mat.unlocked = true;
			mat.unhidden = true;
			mat.createPanel();
			console.log("mat unlocked: " + mat.name);
			unlocked.push(i);
		}else if(percent >= mat.unhidePercentage && !mat.unhidden){
			mat.unhidden = true;
			mat.createMysteryPanel();
			console.log("mat revealed: " + mat.name);
		}
	}
	// remove unlocked mats from lockedMats
	for (var i = unlocked.length-1; i >= 0; i--) {
		lockedMats.splice(i,1);
	}
}

function fixScreenDims() {
	mainFlex.style.height = window.innerHeight + "px";
	canvasSize = Math.max(10, Math.min(mainFlex.offsetWidth * 0.6, mainFlex.offsetHeight * 0.85));
	canvas.width = canvasSize;
	canvas.height = canvasSize;
}

main();