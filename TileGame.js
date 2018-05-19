let charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let mainFlex = document.getElementById("main-flex");
let canvas = document.getElementById("grid-canvas");
let ctx = canvas.getContext("2d");
let matListDiv = $("#list-materials");
let matListTitle = document.getElementById("accordion-materials");
let buttonStack = document.getElementById("buttonstack-main");
let currentWorld = null;
let worlds = {};

let mouseDown = false;
let canvasSize = 100;
let mouseDownPos = new Point(0, 0);
let currentMousePos = new Point(0, 0);
let lastMousePos = new Point(0, 0);
let totalMouseDelta = new Point(0, 0);
let mouseDownCaught = false;
let viewportPos = new Point(-5, -5);
let isMouseDragging = false;
let viewportScale = 1;
let zoomCounter = 0;
let zoomAmount = 1; // change this to manually zoom in/out
let zoom = 1; // DO NOT CHANGE THIS
let dim = 1;
let placing = null;
let pendingReset = false;

let tickCounter = 0

let tileList = [];
let tileCharDict = {};
let materialTypes = {};
let matList;
let lockedMats;
let recipes;

let TAU = Math.PI * 2;

function main() {
	generateTileTypes(tileList, tileCharDict);
	generateMaterialTypes(materialTypes);
	matList = Object.values(materialTypes);
	lockedMats = Object.keys(materialTypes);
	recipes = interpretRecipes();
	interpretRecipes();

	let infoString = localStorage.getItem("gameData");
	if (infoString) {
		console.log("Loading game from local storage...");
		let info = JSON.parse(infoString);
		console.log(info);
		load(info);
	} else {
		// new game setup
		currentWorld = new World("The Grid");
		worlds["The Grid"] = currentWorld;
		aGrid = new Grid(new Point(9, 9));
		currentWorld.enter(aGrid);
		currentWorld.enter(new BGActor());
		mat_bit_alpha.counter = 4;
	}

	initialUnlockMaterialPanels();
	fixScreenDims();
	console.log(currentWorld);

	setInterval(serverTick, 50);
	redraw();
}

function serverTick() {
	Material.prototype.updateAllDetails();
	tickCounter++;
	currentWorld.onTick();
	if (tickCounter % 10 == 0) {
		halfSecondTick();

		if (tickCounter % 40 == 0) {
			secondSecondTick();
		}
	}
	window.requestAnimationFrame(redraw);
}

// calls every half second
function halfSecondTick() {
	unlockMaterialPanels();
}

// ticks every 2 second
function secondSecondTick() {
	for (var i = 0; i < matList.length; i++) {
		let mat = matList[i];
		mat.updateStats();
	}
}

function redraw() {
	zoom = zoomAmount * canvasSize / 100;
	currentWorld.draw(viewportPos, zoom);
}

$(function(){
	addAccordionLogic($(".accordion"))
});

function addAccordionLogic(jqDiv){
	jqDiv.unbind("click.accordion");
	jqDiv.bind("click.accordion", accordionLogic);
	console.log(jqDiv)
	console.log('ACCORDION SLID UP')
	jqDiv.next().slideUp(0);
}

function accordionLogic() {
	console.log('accordion!');
	var panel = $(this.nextElementSibling);
	jthis = $(this);
	panel.slideToggle(200);
	if(jthis.attr('open')){
		panel.removeAttr('open');
		jthis.removeAttr('open');
	}else{
		panel.attr('open', true);
		jthis.attr('open', true);
	}
}

function newTagLogic(){
	if (this.hasAttribute("new")) {
		this.removeAttribute("new");
		this.removeEventListener("click", newTagLogic);
	}
}

function tagAsNew(div){
	div.setAttribute("new", true);
	div.addEventListener("click", newTagLogic);
}

function initialUnlockMaterialPanels() {
	unlocked = []
	for (let i in lockedMats){
		let mat = materialTypes[lockedMats[i]];
		if(mat.unlocked){
			console.log("UNLOCKED PANEL");
			mat.createPanel(false);
			console.log("mat pre-unlocked: " + mat.name);
			unlocked.push(i);
		}else if(mat.unhidden){
			console.log("mat pre-unhidden: " + mat.name);
			mat.createMysteryPanel(false);
		}
	}
	for (var i = unlocked.length - 1; i >= 0; i--) {
		lockedMats.splice(i, 1);
	}
	total = matList.length;
	matListTitle.innerHTML = 'Materials: ' + (total - lockedMats.length) + '/' + total;
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

		if (percent >= mat.unlockPercentage) {
			mat.unlocked = true;
			mat.unhidden = true;
			if(mat.unhidden){
				$(mat.panelDiv).remove();
				mat.hasPanel = false
			}
			mat.createPanel(true);
			unlocked.push(i);
			console.log("mat unlocked: " + mat.name);
		} else if (percent >= mat.unhidePercentage && !mat.unhidden) {
			mat.unhidden = true;
			mat.createMysteryPanel(true);
			console.log("mat revealed: " + mat.name);
		}
	}
	// remove unlocked mats from lockedMats
	for (var i = unlocked.length - 1; i >= 0; i--) {
		lockedMats.splice(i, 1);
	}

	total = matList.length;
	matListTitle.innerHTML = 'Materials: ' + (total - lockedMats.length) + '/' + total;
}

function exportData() {
	info = {};

	matData = {};
	for (let i in matList) {
		mat = matList[i];
		if (mat.unhidden) {
			matData[mat.name] = {
				"n": mat.counter, // number
				"un": mat.usedCounter, // unused number
				"pn": mat.producedCounter, // total produced number
				"ul": mat.unlocked ? 1 : 0, //unlocked
				"uh": mat.unhidden ? 1 : 0 //unhidden
			};
		}
	}
	info["mats"] = matData;
	worldData = {};
	for (let wname in worlds) {
		world = worlds[wname];
		actorData = [];
		for (let aname in world.actors) {
			datum = {};
			world.actors[aname].saveInfo(datum);
			actorData.push(datum);
		}
		worldData[world.name] = {
			"actors": actorData
		}
	}
	info["worlds"] = worldData;
	info["activeWorld"] = currentWorld.name;
	return info;
}

function save() {
	localStorage.setItem("gameData", JSON.stringify(exportData()));
}

function load(info) {
	let matData = info["mats"];
	for (let mname in matData) {
		let mDatum = matData[mname];
		let mat = materialTypes[mname];
		mat.counter = mDatum['n'];
		mat.usedCounter = mDatum['un'];
		mat.producedCounter = mDatum['pn'];
		mat.unlocked = mDatum['ul'];
		mat.unhidden = mDatum['uh'];
		for (let i = 0; i < mat.recipe.length; i++) {
			let req = mat.recipe[i];
			req[3] = Math.ceil(req[1] * Math.pow(req[2], mat.usedCounter + mat.counter));
		}
	}

	let worldData = info["worlds"];
	for (let wname in worldData) {
		let worldDatum = worldData[wname];
		let world = new World(wname);
		worlds[wname] = world;

		let actorData = worldDatum["actors"];
		for (let adi in actorData) {
			let actorDatum = actorData[adi];
			let actor = new actorTypeDict[actorDatum["type"]].prototype.constructor();
			actor.loadInfo(actorDatum);
			world.enterNow(actor);
		}
	}
	currentWorld = worlds[info["activeWorld"]];
}

function fixScreenDims() {
	canvasSize = Math.max(10, Math.min(window.innerWidth * 0.6 - 85, window.innerHeight - 125));
	canvas.width = canvasSize;
	canvas.height = canvasSize;
}

$(main);