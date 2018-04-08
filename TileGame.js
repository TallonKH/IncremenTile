class Point {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	addp(other) {
		return new Point(this.x + other.x, this.y + other.y);
	}

	subtractp(other) {
		return new Point(this.x - other.x, this.y - other.y);
	}

	multiplyp(other) {
		return new Point(this.x * other.x, this.y * other.y);
	}

	dividep(other) {
		return new Point(this.x / other.x, this.y / other.y);
	}

	add1(other) {
		return new Point(this.x + other, this.y + other);
	}

	subtract1(other) {
		return new Point(this.x - other, this.y - other);
	}

	multiply1(other) {
		return new Point(this.x * other, this.y * other);
	}

	divide1(other) {
		return new Point(this.x / other, this.y / other);
	}

	add2(x,y) {
		return new Point(this.x + x, this.y + y);
	}

	subtract2(x,y) {
		return new Point(this.x - x, this.y - y);
	}

	multiply2(x,y) {
		return new Point(this.x * x, this.y * y);
	}

	divide2(x,y) {
		return new Point(this.x / x, this.y / y);
	}

	floor() {
		return new Point(Math.floor(this.x), Math.floor(this.y));
	}

	addComponents() {
		return this.x + this.y;
	}

	lengthSquared() {
		return this.x * this.x + this.y * this.y;
	}

	length() {
		return Math.sqrt(this.lengthSquared());
	}
}

class World {
	constructor(id, name) {
		this.id = id;
		this.name = name;
		this.actors = [];
		this.mouseListeners = [];
		this.mouseDownActors = [];
		this.actorsPendingEnter = [];
		this.actorsPendingExit = [];
		this.actorsPendingTick = [];

		this.background = new BGActor();
		this.enter(this.background);
	}
	// put an actor into the world
	enterNow(actor) {
		actor.world = this;
		insertSorted(this.actors, actor, function(a, b) {
			return a.zPriority - b.zPriority;
		});
		if (actor.clickOpacity) {
			insertSorted(this.mouseListeners, actor, function(a, b) {
				return b.zPriority - a.zPriority;
			});
		}
		if (actor.tickable) {
			this.actorsPendingTick.push(actor);
		}
	}

	enter(actor) {
		this.actorsPendingEnter.push(actor);
	}

	exitNow(actor) {
		actor.world = null;
		this.actors.splice(this.actors.indexOf(actor),1);
		if (actor.clickOpacity) {
			this.mouseListeners.splice(this.mouseListeners.indexOf(actor),1);
		}
	}

	exit(actor) {
		this.actorsPendingExit.push(actor);
	}

	draw(viewportPos, zoom) {
		for (let i = 0; i < this.actors.length; i++) {
			let actor = this.actors[i];
			actor.draw(viewportPos, zoom);
		}
	}

	//return true if mouse is blocked; false otherwise, even if mouse is caught by translucent
	onMouseDown(point) {
		for (let i = 0; i < this.mouseListeners.length; i++) {
			let clickable = this.mouseListeners[i];
			if (clickable.isTouching(point)) {
				clickable.onMouseDown(point);
				this.mouseDownActors.push(clickable);
				if (clickable.clickOpacity == clickOpacity.OPAQUE) {
					return true;
				}
			}
		}
		return false;
	}

	onMouseUp(point) {
		for (let i = 0; i < this.mouseListeners.length; i++) {
			let clickable = this.mouseListeners[i];
			if (clickable.isTouching(point)) {
				clickable.onMouseUp(point);
				if (this.mouseDownActors.includes(clickable) && totalMouseDelta.lengthSquared() < 10) {
					clickable.onMouseClicked(point);
				}
				if (clickable.clickOpacity == clickOpacity.OPAQUE) {
					this.mouseDownActors = [];
					return true;
				}
			}
		}
		this.mouseDownActors = [];
		return false;
	}

	onTick(skippedTicks) {
		while (this.actorsPendingExit.length > 0) {
			this.exitNow(this.actorsPendingExit.pop());
		}
		while (this.actorsPendingEnter.length > 0) {
			this.enterNow(this.actorsPendingEnter.pop());
		}

		for (let i = 0; i < this.actorsPendingTick.length; i++) {
			this.actorsPendingTick[i].onTick(skippedTicks);
		}

		// do things that cannot be multiplied
		while (skippedTicks > 0) {
			//...
			skippedTicks--;
		}
	}
}

function pushAll(a, b) {
	Array.prototype.push.apply(a, b);
}

function insertSorted(list, val, comparator = function(a, b) {
	return a - b;
}) {
	if (list.length == 0) {
		list.push(val);
		return 0;
	}
	start = 0;
	end = list.length;
	i = Math.floor(list.length / 2);
	while (true) {
		let diffFormer = comparator(val, list[i]);

		if (diffFormer == 0) {
			if (i + 1 == list.length) {
				list.push(val);
				return i + 1;
			}
			let diffLatter = comparator(val, list[i + 1]);
			if (diffLatter == 0) {
				list.splice(i, 0, val);
				return i;
			}
			if (diffLatter > 0) {
				start = i;
				i = Math.floor((i + end) / 2);
				continue;
			} else {
				if (i == 0) {
					list.splice(0, 0, val);
					return 0;
				}
				end = i;
				i = Math.floor((start + i) / 2);
				continue;
			}
		}
		if (diffFormer > 0) {
			if (i + 1 == list.length) {
				list.push(val);
				return i + 1;
			}

			let diffLatter = comparator(val, list[i + 1]);

			if (diffLatter == 0) {
				list.splice(i + 1, 0, val);
				return i + 1;
			}
			if (diffLatter > 0) {
				start = i;
				i = Math.floor((i + end) / 2);
				continue;
			} else {
				end = i;
				i = Math.floor((start + i) / 2);
				continue;
			}
		} else {
			if (i == 0) {
				list.splice(0, 0, val);
				return 0;
			}
			end = i;
			i = Math.floor((start + i) / 2);
			continue;
		}
	}
}

function defaultDraw(renderX, renderY, renderScale) {
	ctx.fillStyle = "#cccccc";
	ctx.strokeStyle = "#ff0000";
	ctx.fillRect(renderX, renderY, renderScale, renderScale);
	ctx.strokeRect(renderX, renderY, renderScale, renderScale);
}

class TileType {
	constructor(name) {
		this.name = name;
		this.onTick = Function.prototype; // (grid, data, skippedTicks)
		this.onMouseClicked = Function.prototype; // (grid,data,fCoord)
		this.destroyed = function(){if(this.associatedMaterial){this.associatedMaterial.unplace();}}; // (grid,data,replacementTypeName)
		this.created = Function.prototype; // (grid,data)
		this.draw = Function.prototype; // (grid,data,renderX,renderY,renderScale)
		this.associatedMaterial = null;
		this.initialData = function(grid, x, y) {
			return {
				"dims": new Point(x, y),
				"pendingTick": false
			};
		};
	}
	drawBasicRect(misc) {
		let [grid, data, renderX, renderY, renderScale] = misc;
		ctx.fillRect(renderX, renderY, renderScale, renderScale);
	}
	drawOutline(misc, thickness) {
		let [grid, data, renderX, renderY, renderScale] = misc;
		ctx.lineWidth = thickness * renderScale;
		let size = (1 - thickness) * renderScale;
		thickness *= renderScale / 2;
		ctx.strokeRect(renderX + thickness, renderY + thickness, size, size);
	}
	drawSmallRect(misc, size) {
		let [grid, data, renderX, renderY, renderScale] = misc;
		let offset = (1 - size) / 2 * renderScale;
		size *= renderScale;
		ctx.fillRect(renderX + offset, renderY + offset, size, size);
	}
	drawText(misc, text, size) {
		let [grid, data, renderX, renderY, renderScale] = misc;
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.font = Math.floor(renderScale * size) + "px serif";
		let mid = 0.5 * renderScale
		ctx.fillText(text, renderX + mid, renderY + mid);
	}
	drawBasicTimer(misc, size = 0.5, percent) {
		let [grid, data, renderX, renderY, renderScale] = misc;

		let mid = 0.5 * renderScale;
		let midX = renderX + mid;
		let midY = renderY + mid;
		size *= renderScale;

		ctx.lineWidth = renderScale * 0.08;
		ctx.beginPath();
		ctx.arc(midX, midY, size, 0, TAU);
		ctx.stroke();

		ctx.strokeStyle = hexLerp(activeColor, inactiveColor, percent);
		ctx.lineWidth = renderScale * 0.06;
		ctx.beginPath();
		ctx.arc(midX, midY, size, 0, percent * TAU);
		ctx.stroke();
	}
	drawPulser(misc) {
		let [grid, data, renderX, renderY, renderScale] = misc;
		let mid = 0.5 * renderScale;
		let midX = renderX + mid;
		let midY = renderY + mid;
		let cd = data["cooldown"][0];
		let ticker = data["max_cooldown"][0] - cd;
		ctx.lineWidth = 0.03 * renderScale;
		let c1 = (activeColor + "55");
		let c2 = (inactiveColor + "55");
		ctx.strokeStyle = cd == 0 ? activeColor : inactiveColor
		ctx.fillStyle = (Math.abs(ticker - 6) <= 2) ? c1 : c2;
		ctx.beginPath();
		ctx.arc(midX, midY, 0.3 * renderScale, TAU, 0);
		ctx.stroke();
		ctx.fill();

		ctx.fillStyle = (Math.abs(ticker - 5) <= 2) ? c1 : c2;
		ctx.beginPath();
		ctx.arc(midX, midY, 0.25 * renderScale, TAU, 0);
		ctx.fill();

		ctx.fillStyle = (Math.abs(ticker - 4) <= 2) ? c1 : c2;
		ctx.beginPath();
		ctx.arc(midX, midY, 0.2 * renderScale, TAU, 0);
		ctx.fill();

		ctx.fillStyle = (Math.abs(ticker - 3) <= 2) ? c1 : c2;
		ctx.beginPath();
		ctx.arc(midX, midY, 0.15 * renderScale, TAU, 0);
		ctx.fill();

		ctx.fillStyle = (Math.abs(ticker - 2) <= 2) ? c1 : c2;
		ctx.beginPath();
		ctx.arc(midX, midY, 0.1 * renderScale, TAU, 0);
		ctx.fill();

		ctx.fillStyle = (Math.abs(ticker - 1) <= 2) ? c1 : c2;
		ctx.beginPath();
		ctx.arc(midX, midY, 0.05 * renderScale, TAU, 0);
		ctx.fill();
	}
}

class Material {
	constructor(name, displayName, primary, secondary) {
		this.name = name;
		this.displayName = displayName;
		this.counter = 0;
		this.usedCounter = 0;
		this.primaryColor = primary;
		this.secondaryColor = secondary;
		this.craftable = true;
		this.consumable = true;
		this.recipe = [];
		this.recipesThatNeed = [];
		this.associatedTile = null;
		this.genPerSecCounter = 0;
		this.usePerSecCounter = 0;
		this.consumeAction = Function.prototype;

		this.unlocked = false;
		this.unhidden = false;
		this.unlockPercentage = 0.75;
		this.unhidePercentage = 0.25;

		this.panelDiv = null;
		this.titleDiv = null;
		this.detailsDiv = null;
		this.buttonDiv = null;
		this.statsDiv = null;
	}

	updateStats(skippedSeconds){
		if(this.unlocked){
			let str = "<b>Stats</b>";
			str += "<br /><font color=\'#149d19\'>+ " + (this.genPerSecCounter / skippedSeconds) + " per second</font>";
			str += "<br /><font color=\'#b60f0f\'>- " + (this.usePerSecCounter / skippedSeconds) + " per second</font>";
			let use = this.usePerSecCounter / skippedSeconds;

			this.genPerSecCounter = 0;
			this.usePerSecCounter = 0;
			this.statsDiv.innerHTML = str;
		}
	}

	increment(count) {
		this.setCounter(this.counter + count);
		this.genPerSecCounter += count;
	}

	decrement(count){
		this.setCounter(this.counter - count);
		this.usePerSecCounter += count;
	}

	unplace(){
		this.usedCounter--;
		this.increment(1);
	}

	setCounter(count) {
		this.counter = count;

		if(this.consumable){
			this.titleDiv.innerHTML = this.displayName + " : " + count + " : " + this.usedCounter;
		}else{
			this.titleDiv.innerHTML = this.displayName + " : " + count;
		}
	}

	createPanel() {
		let inner =
		"<button class=\"accordion mat-abutton\" new=\"true\" style=\"background-color: " + this.primaryColor + "; border-color: " +
		this.secondaryColor + "; color: " + this.secondaryColor + ";\">" +
			this.displayName + " : " + this.counter +
		"</button><div class=\"accordion-pane mat-apane\"><div class=\"mat-buttons\"></div> <div class=\"mat-details\"></div><div class=\"mat-stats\"></div></div>";

		if(this.panelDiv != null){
			this.panelDiv.innerHTML = inner;
		}else{
			matListDiv.innerHTML +=
			"<div class=\"material-pane info-pane\" id=" + this.name + ">" +
			inner +
			"</div>";
		}
		Material.prototype.updateAllDivRefs();
		this.updateDetails();
	}

	createMysteryPanel(){
		matListDiv.innerHTML +=
		"<div class=\"material-pane info-pane\" id=" + this.name + ">" +
			"<button class=\"accordion mat-abutton\" new=\"true\" style=\"background-color: #aaaaaa; border-color: #888888; color: #666666;\">????</button>" +
			"<div class=\"accordion-pane mat-apane\"><div class=\"mat-details\"></div></div>" +
		"</div>";
		Material.prototype.updateAllDivRefs();
	}

	updateAllDivRefs(){
		for (var i = 0; i < matList.length; i++) {
			let mat = matList[i];
			if(mat.unhidden){
				mat.updateDivRefs();
			}
		}
	}

	updateDivRefs(){
		this.panelDiv = getChildDivById(matListDiv, this.name);
		this.titleDiv = getChildDivByClass(this.panelDiv, "accordion mat-abutton");
		let accordionPane = getChildDivByClass(this.panelDiv, "accordion-pane mat-apane")
		this.detailDiv = getChildDivByClass(accordionPane, "mat-details");
		this.buttonDiv = getChildDivByClass(accordionPane, "mat-buttons");
		this.statsDiv = getChildDivByClass(accordionPane, "mat-stats");
		this.generateButtons();
		addAccordionLogic(this.titleDiv);
	}

	updateAllDetails(){
		for (var i = 0; i < matList.length; i++) {
			let mat = matList[i];
			if(mat.unhidden){
				mat.updateDetails();
			}
		}
	}

	updateDetails(){
		this.detailDiv.innerHTML = this.generateUnlockProgressBars() + this.generateCraftProgressBars();
		if(this.unlocked){
			if(this.craftable){
				getChildDivByClass(this.buttonDiv, "mat-button button-craft")
				.setAttribute("useable", this.hasSufficientMaterials());
			}
			if(this.consumable){
				getChildDivByClass(this.buttonDiv, "mat-button button-consume")
				.setAttribute("useable", this.counter > 0);
			}
		}
	}

	hasSufficientMaterials(){
		if(!this.craftable){
			return false;
		}

		for (var i = 0; i < this.recipe.length; i++) {
			let req = this.recipe[i];
			if(req[0].counter < req[3]){
				return false;
			}
		}
		return true;
	}

	generateUnlockProgressBars(){
		if(!this.unlocked){
			let divs = "<b>UNLOCK</b><br /><div style=\"margin-left: 10px;\">";
			for (var i = 0; i < this.recipe.length; i++) {
				let req = this.recipe[i];
				let mat = req[0];
				let max = Math.ceil(this.unlockPercentage * req[1]);
				divs += mat.counter + "/" + max + " " + mat.displayName +
				": <progress value=\"" + mat.counter + "\" max=\"" + max + "\"></progress><br />";
			}
			return divs + "</div>";
		}
		return "";
	}

	generateCraftFunction(){
		let mat = this;
		return function(){
			if(mat.hasSufficientMaterials()){
				for (let i = 0; i < mat.recipe.length; i++) {
					let req = mat.recipe[i];
					req[0].decrement(req[3]);
					req[3] = Math.ceil(req[1] * Math.pow(req[2], 1 + mat.usedCounter + mat.counter));
				}
				mat.increment(1);
			}
		}
	}

	generateConsumeFunction(){
		let mat = this;
		return function(){
			if(mat.counter > 0){
				mat.usedCounter++;
				mat.decrement(1);
				mat.consumeAction();
			}
		}
	}

	generateButtons(){
		if(this.unlocked){
			let div = "";
			let num = 0;
			if(this.craftable){
				num ++;
				div += "<button class=\"mat-button button-craft\">CRAFT</button>";
			}
			if(this.consumable){
				num ++;
				div += "<button class=\"mat-button button-consume\">USE</button>";
			}

			this.buttonDiv.innerHTML = div + (num ? "<br />" : "");

			if(this.craftable){
				getChildDivByClass(this.buttonDiv, "mat-button button-craft")
				.addEventListener("click", this.generateCraftFunction());
			}
			if(this.consumable){
				getChildDivByClass(this.buttonDiv, "mat-button button-consume")
				.addEventListener("click", this.generateConsumeFunction());
			}
		}
	}

	generateCraftProgressBars(){
		if(this.unlocked && this.recipe.length > 0){
			let divs = "<div style=\"margin-left: 10px;\">";
			for (var i = 0; i < this.recipe.length; i++) {
				let req = this.recipe[i];
				let mat = req[0];
				let max = req[3];
				if(this.unlocked){
					divs += mat.counter + "/" + max + " " + mat.displayName +
					": <progress value=\"" + mat.counter + "\" max=\"" + max + "\"></progress><br />";
				}else{
					divs += mat.counter + "/?? " + mat.displayName + "<br />";
				}
			}
			return divs + "</div>";
		}
		return "";
	}

	generateBuildMenu(){

	}
}

class Actor {
	constructor() {
		this.pos = new Point(0, 0);
		this.scale = 10;
		this.clickOpacity = clickOpacity.TRANSPARENT;
		this.onMouseDown = Function.prototype;
		this.onMouseUp = Function.prototype;
		this.onMouseMove = Function.prototype;
		this.onMouseClicked = Function.prototype;
		this.onTick = Function.prototype;
		this.tickable = false;
		this.world = null;
		this.zPriority = 0; //higher z = closer to screen = covers other stuff and is visible first
		this.isTouching = function(point) {
			return false;
		};
		this.draw = function(viewportPos, zoom) {
			let renderPos = this.pos.subtractp(viewportPos).multiply1(zoom);
			let renderScale = this.scale * zoom; //viewportScale 0.5 = half screen, viewportScale 2 is 2x size
			ctx.beginPath();
			ctx.strokeStyle = "red";
			ctx.arc(renderPos.x, renderPos.y, renderScale, 0, 2 * Math.PI);
			ctx.stroke();
		}
	}
}

class BGActor extends Actor {
	constructor() {
		super();
		this.clickOpacity = clickOpacity.OPAQUE;
		this.isTouching = function(point) {
			return true;
		}
		this.bgcolor = "#ffffff";
		this.zPriority = -1;
		this.tickable = false;
		this.onMouseDown = function(e) {

		}
		this.draw = function(viewportPos, zoom) {
			ctx.fillStyle = this.bgcolor;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}
	}
}

class Grid extends Actor {
	constructor(dims) {
		super();
		this.tickable = true;
		this.dims = dims
		this.tickedTiles = [];
		this.pendingTick = [];
		this.clickOpacity = clickOpacity.OPAQUE;
		this.tiles = makeGrid(dims, function(x, y) {
			return tile_empty;
		});
		this.tileData = makeGrid(dims, function(x, y) {
			return {};
		});
		this.onTick = function(skippedTicks) {
			this.tickedTiles = this.pendingTick;
			this.pendingTick = [];
			for (let i = 0; i < this.tickedTiles.length; i++) {
				let coord = this.tickedTiles[i];
				let type = this.getTile(coord);
				let data = this.getData(coord);
				data["pendingTick"] = false;
				type.onTick(this, data, skippedTicks);
			}
		}

		this.isTouching = function(point) {
			return (point.x >= this.pos.x) && (point.x <= this.pos.x + this.scale * this.dims.x) &&
				(point.y >= this.pos.y) && (point.y <= this.pos.y + this.scale * this.dims.y);
		}

		this.onMouseDown = function(point) {
			let pointRel = point.subtractp(this.pos);
			let gridCoord = pointRel.divide1(this.scale).floor();
		}

		this.onMouseUp = function(point) {
			let pointRel = point.subtractp(this.pos);
			let gridCoord = pointRel.divide1(this.scale).floor();
		}

		this.onMouseClicked = function(point) {
			let pointRel = point.subtractp(this.pos);
			let gridCoord = pointRel.divide1(this.scale).floor();
			if(placing){
				this.setTile(gridCoord, placing);
				placing = null;
			}else{
				this.getTile(gridCoord).onMouseClicked(this, this.getData(gridCoord), 1);
			}
		}

		this.draw = function(viewportPos, zoom) {
			let renderPos = this.pos.subtractp(viewportPos).multiply1(zoom);
			let renderScale = this.scale * zoom;
			for (let y = 0; y < this.dims.y; y++) {
				for (let x = 0; x < this.dims.x; x++) {
					this.tiles[x][y].draw(this, this.tileData[x][y],
						renderPos.x + x * renderScale, renderPos.y + y * renderScale, renderScale);
				}
			}
		}
	}

	getAdjacentCoords(coord) {
		let adj = [];
		if (coord.x > 0) {
			adj.push(new Point(coord.x - 1, coord.y));
		}
		if (coord.x + 1 < this.dims.x) {
			adj.push(new Point(coord.x + 1, coord.y));
		}
		if (coord.y > 0) {
			adj.push(new Point(coord.x, coord.y - 1));
		}
		if (coord.y + 1 < this.dims.y) {
			adj.push(new Point(coord.x, coord.y + 1));
		}
		return adj;
	}

	getSurroundingCoords(coord, radius = 1) {
		minX = Math.max(0, coord.x - radius);
		maxX = Math.min(this.dims.x - 1, coord.x + radius);
		minY = Math.max(0, coord.y - radius);
		maxY = Math.min(this.dims.y - 1, coord.y + radius);
		let sur = [];
		for (let y = minY; y < maxY; y++) {
			for (let x = minX; x < maxX; x++) {
				if (x != 0 || y != 0) {
					sur.push(new Point(coord.x + x, coord.y + y));
				}
			}
		}
		return sur;
	}

	getTile(coord) {
		return this.tiles[coord.x][coord.y];
	}

	requestNextTick(coord) {
		let data = this.getData(coord);
		if (this.getTile(coord).tickable && !data["pendingTick"]) {
			data["pendingTick"] = true;
			this.pendingTick.push(coord);
		}
	}

	getData(coord) {
		return this.tileData[coord.x][coord.y];
	}

	setTile(coord, type) {
		let prev = this.getTile(coord);
		let prevData = this.getData(coord);
		prev.destroyed(grid, prevData, type);

		let data = type.initialData(this, coord.x, coord.y);
		this.tiles[coord.x][coord.y] = type;
		this.tileData[coord.x][coord.y] = data;
		type.created(this, data);
		return {
			"type": prev,
			"data": prevData
		};
	}
}
Grid.counter = 0;

const clickOpacity = {
	OPAQUE: 2, // capture mouse and block things behind
	TRANSLUCENT: 1, // capture mouse but let things behind receive
	TRANSPARENT: 0 // ignore mouse input
}

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

let activeColor = "#88ccff";
let inactiveColor = "#4444aa";
let fillColorAlpha = "#bb6622";
let lineColorAlpha = "#441100";
let fillColorBeta = "#5ebb22";
let lineColorBeta = "#2b6e00";


let tileTypes;
let materialTypes;
let matList;
let lockedMats;
let recipes;
let TAU = Math.PI * 2;

function fixScreenDims() {
	mainFlex.style.height = window.innerHeight + "px";
	canvasSize = Math.max(10, Math.min(mainFlex.offsetWidth * 0.6, mainFlex.offsetHeight * 0.85));
	canvas.width = canvasSize;
	canvas.height = canvasSize;
}

window.onresize = fixScreenDims;

canvas.onmousedown = function(event) {
	totalMouseDelta = new Point(0, 0);
	mouseDown = true;
	mouseDownPos = calcMousePos(event);
	mouseDownCaught = currentWorld.onMouseDown(mouseDownPos);
	//TODO translate mouse coords to actor bounding box coords properly
}

canvas.onmouseup = function(event) {
	mouseDown = false;
	isMouseDragging = false;
	mouseUpCaught = currentWorld.onMouseUp(calcMousePos(event));
}

canvas.addEventListener('mousewheel',function(event){
	if(event.ctrlKey){
		let prev = zoomAmount;
		zoomCounter -= event.deltaY;
		zoomCounter = Math.max(Math.min(zoomCounter, 1000),0);
		zoomAmount = Math.pow(10,zoomCounter/1000);
		let diff = (zoomAmount - prev)/canvasSize;
		viewportPos = viewportPos.addp(new Point(0.5,0.5).multiply1(diff));
	}else{
		viewportPos = viewportPos.add2(event.deltaX/zoomAmount/10,event.deltaY/zoomAmount/10);
	}
	event.preventDefault();
  return false;
}, false);

function calcMousePos(event) {
	return new Point((event.clientX - canvas.offsetLeft + window.pageXOffset) / zoom + viewportPos.x, (event.clientY - canvas.offsetTop + window.pageYOffset) / zoom + viewportPos.y);
}

function calcMousePos2(event) {
	return new Point((event.clientX - canvas.offsetLeft + window.pageXOffset) / zoom, (event.clientY - canvas.offsetTop + window.pageYOffset) / zoom);
}

canvas.onmousemove = function(event) {
	currentMousePos = calcMousePos(event);
	lastMouseDelta = lastMousePos.subtractp(currentMousePos);
	totalMouseDelta = mouseDownPos.subtractp(currentMousePos);
	//do stuff
	lastMousePos = currentMousePos;
}

function main() {
	tileTypes = generateTileTypes();
	materialTypes = generateMaterialTypes();
	matList = Object.values(materialTypes);
	lockedMats = Object.keys(materialTypes);
	recipes = interpretRecipes();
	handleAccordions();
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
	console.log("short tick : " + skippedTicks);
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
	console.log("\t\t\tSECOND TICK : " + skippedSeconds);
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

function getChildDivByClass(div, clas){
	let children = div.childNodes;
	for (var i = 0; i < children.length; i++) {
		let child = children[i];
		if(child.className == clas){
			return child;
		}
	}
	return null;
}

function getChildDivById(div, id){
	let children = div.childNodes;
	for (var i = 0; i < children.length; i++) {
		let child = children[i];
		if(child.id == id){
			return child;
		}
	}
	return null;
}

function makeGrid(dims, type) {
	grid = [];
	for (let x = 0; x < dims.x; x++) {
		row = [];
		grid[x] = row;
		for (let y = 0; y < dims.y; y++) {
			row[y] = type(x, y);
		}
	}
	return grid;
}

function griderate() { //iterate through grid

}

function handleAccordions() {
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

let tile_empty = new TileType("empty");
let tile_gen_alpha = new TileType("gen_alpha");
let tile_pulser_alpha = new TileType("pulser_alpha");

function generateTileTypes() {
	var types = {};

	tile_empty.draw = function(grid, data, renderX, renderY, renderScale) {
		ctx.fillStyle = "#eeeeee";
		ctx.fillRect(renderX + (0.2 * renderScale), renderY + (0.2 * renderScale), renderScale * 0.6, renderScale * 0.6);
	}
	tile_empty.initialData = function(x, y) {
		return {};
	};
	types["empty"] = tile_empty;

	tile_gen_alpha.tickable = true;
	tile_gen_alpha.clickable = true;
	tile_gen_alpha.associatedMaterial = mat_gen_alpha;
	tile_gen_alpha.draw = function(grid, data, renderX, renderY, renderScale) {
		misc = [grid, data, renderX, renderY, renderScale];
		ctx.fillStyle = fillColorAlpha;
		this.drawBasicRect(misc);
		ctx.strokeStyle = lineColorAlpha;
		this.drawOutline(misc, 0.02);

		let cdVal = Math.max(0, data["cooldown"][0]);

		ctx.fillStyle = (cdVal == 0) ? activeColor : inactiveColor;
		this.drawText(misc, 'α', 0.4);

		let cdPercent = 1 - cdVal / data["max_cooldown"][0];
		this.drawBasicTimer(misc, 0.4, cdPercent);
	}
	tile_gen_alpha.onTick = function(grid, data, skippedTicks) {
		let cooldown = data["cooldown"];
		if (cooldown[0] > 0) {
			cooldown[0] -= skippedTicks;
			grid.requestNextTick(data["coord"]);
		}
	}
	tile_gen_alpha.created = function(grid, data) {
		grid.requestNextTick(data["coord"]);
	}
	tile_gen_alpha.onMouseClicked = function(grid, data, clickTicks) {
		let cooldown = data["cooldown"];
		if (cooldown[0] <= 0) {
			mat_bit_alpha.increment(clickTicks);
			cooldown[0] = data["max_cooldown"][0];
			grid.requestNextTick(data["coord"]);
		}
	}
	tile_gen_alpha.initialData = function(grid, x, y) {
		let cd = 64;
		return {
			"coord": new Point(x, y),
			"max_cooldown": [cd],
			"pendingTick": false,
			"cooldown": [cd]
		};
	};
	types["gen_alpha"] = tile_gen_alpha;

	tile_pulser_alpha.tickable = true;
	tile_pulser_alpha.clickable = true;
	tile_pulser_alpha.associatedMaterial = mat_pulser_alpha;
	tile_pulser_alpha.draw = function(grid, data, renderX, renderY, renderScale) {
		misc = [grid, data, renderX, renderY, renderScale];
		ctx.fillStyle = fillColorAlpha;
		this.drawBasicRect(misc);
		ctx.strokeStyle = lineColorAlpha;
		this.drawOutline(misc, 0.02);

		let cdVal = Math.max(0, data["cooldown"][0]);

		ctx.fillStyle = (cdVal == 0) ? activeColor : inactiveColor;

		let cdPercent = 1 - cdVal / data["max_cooldown"][0];
		this.drawBasicTimer(misc, 0.4, cdPercent);

		this.drawPulser(misc, 0);
	}
	tile_pulser_alpha.onTick = function(grid, data, skippedTicks) {
		let cooldown = data["cooldown"];
		if (cooldown[0] > 0) {
			cooldown[0] -= skippedTicks;
			grid.requestNextTick(data["coord"]);
		}
	}
	tile_pulser_alpha.created = function(grid, data) {
		grid.requestNextTick(data["coord"]);
	}
	tile_pulser_alpha.onMouseClicked = function(grid, data, clickTicks) {
		let cooldown = data["cooldown"];
		if (cooldown[0] <= 0) {
			cooldown[0] = data["max_cooldown"][0];
			let adj = grid.getAdjacentCoords(data["coord"]);
			for (let i = 0; i < adj.length; i++) {
				let otherCoord = adj[i];
				let otherType = grid.getTile(otherCoord);
				if (otherType.clickable) {
					otherType.onMouseClicked(grid, grid.getData(otherCoord), clickTicks);
				}
			}
			grid.requestNextTick(data["coord"]);
		} else {}
	}
	tile_pulser_alpha.initialData = function(grid, x, y) {
		let cd = 64;
		return {
			"coord": new Point(x, y),
			"max_cooldown": [cd],
			"pendingTick": false,
			"cooldown": [cd]
		};
	};
	types["pulser_alpha"] = tile_pulser_alpha;

	return types;
}

let mat_bit_alpha = new Material("bit_alpha", "Alpha Bits", fillColorAlpha, lineColorAlpha);
let mat_gen_alpha = new Material("gen_alpha", "Alpha Generator", fillColorAlpha, lineColorAlpha);
let mat_pulser_alpha = new Material("pulser_alpha", "Alpha Pulser", fillColorAlpha, lineColorAlpha);
let mat_bit_beta = new Material("bit_beta", "Beta Bits", fillColorBeta, lineColorBeta);
function generateMaterialTypes() {
	mats = {};

	mat_bit_alpha.unhidePercentage = 0;
	mat_bit_alpha.unlockPercentage = 0;
	mat_bit_alpha.counter = 4;
	mat_bit_alpha.craftable = false;
	mat_bit_alpha.consumable = false;
	mats["bit_alpha"] = (mat_bit_alpha);

	mat_gen_alpha.unhidePercentage = 0;
	mat_gen_alpha.unlockPercentage = 0.0;
	mat_gen_alpha.recipe = [[mat_bit_alpha, 4, 1.2, 4]];
	mat_gen_alpha.associatedTile = tile_gen_alpha;
	mat_gen_alpha.consumeAction = function(){placing = tile_gen_alpha;}
	mats["gen_alpha"] = (mat_gen_alpha);

	mat_pulser_alpha.unhidePercentage = 0.25;
	mat_pulser_alpha.unlockPercentage = 0.5;
	mat_pulser_alpha.recipe = [[mat_bit_alpha, 32, 1.4, 32]];
	mat_pulser_alpha.associatedTile = mat_pulser_alpha;
	mat_pulser_alpha.consumeAction = function(){placing = tile_pulser_alpha;}
	mats["pulser_alpha"] = (mat_pulser_alpha);

	mat_bit_beta.unhidePercentage = 0.125;
	mat_bit_beta.unlockPercentage = 0.5;
	mat_bit_beta.craftable = false;
	mat_bit_beta.consumable = false;
	mat_bit_beta.recipe = [[mat_bit_alpha, 1024, 1, 1024]];
	mats["bit_beta"] = (mat_bit_beta);

	return mats;
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

function interpretRecipes() {
	for (var i = 0; i < mats.length; i++) {
		let mat = mats[i];
		for (var i = 0; i < mat.recipe.length; i++) {
			let ingredient = mat.recipe[i][0];
			ingredient.recipesThatNeed.push(mat);
		}
	}
}

function hexLerp(a, b, x) {
	let r1 = parseInt(a.substring(1, 3), 16);
	let g1 = parseInt(a.substring(3, 5), 16);
	let b1 = parseInt(a.substring(5, 7), 16);
	let r2 = parseInt(b.substring(1, 3), 16);
	let g2 = parseInt(b.substring(3, 5), 16);
	let b2 = parseInt(b.substring(5, 7), 16);
	y = 1 - x;
	let rr = Math.floor(r1 * x + r2 * y).toString(16);
	let gg = Math.floor(g1 * x + g2 * y).toString(16);
	let bb = Math.floor(b1 * x + b2 * y).toString(16);
	rr = "0".repeat(2 - rr.length) + rr;
	gg = "0".repeat(2 - gg.length) + gg;
	bb = "0".repeat(2 - bb.length) + bb;
	return '#' + rr + gg + bb;
}

main();

//TILE TYPES
/*
 * Generators: add 1 material to chache
 * - have cooldown
 * - TIER: very expensive recipe, function slower, output next tier material, consume 1k of prev material per
 *
 * Multipliers: multiply stats of adjacent tiles
 * : double output count of Generators & halve cooldown
 * : double speed of Timers and also amount of clicks
 * : halve cooldown of Pulsers
 * : halve cooldown of Crafters
 * - do nothing when clicked
 * - can be stacked for maximum x16 per tile
 * - cannot multiply other Multipliers
 * - TIER: higher multiplier
 *
 * Pulsers: activate adjacent / surrounding tiles
 * - can activate adjacent Pulsers
 * - have cooldown
 * - TIER : more range & lower cooldown
 *
 * Timers: every x ticks, activate frontwards tile for a total of y times
 * - allow rotation of timers to be changed
 * - activations should only count if anything was successfully activated
 * - if a timer runs out of clicks, clicking it can reset it
 * - timers can also be reset automatically, but ONLY BY OTHER TIMERS and ONLY FROM BEHIND
 * - - this allows stacking Timers for exponential AFK clicks
 * - - only Timers & only behind prevents looping Timers infinitely
 * - limited clicks forces the player to not cheat via AFKing for extended times
 * - TIER: more clicks & lower cooldown
 *
 * Crafters: required to craft higher-tier tiles
 * - have really long cooldown
 * - TIER: lower cooldown
 */

//BALANCE PHILOSOPHY
/*
 * Every tile type gets increasingly expensive
 * - prevents spamming generators everywhere
 *
 * Destroying/replacing a tile will give back all ingredients
 * - need to account for price increase
 *
 * All cooldowns capped to 1 tick (cannot be 0)
 *
 * 1 kilobit required to craft 1 bit of next tier material
 * - 1 alpha kilobit --> 1 betabit
 *
 * equiv materials of a tile can be used to upgrade it
 * - cannot skip tiers
 * - price increase should be decided by number of upgraded tiles, not base tiles
 *
 * 1 megabit should unlock a new dimension - once per tier
 *
 * Generator consumption allows production of exponentially better stuff without making lower tiers useless
 *
 * Achievement descriptions should be dynamic (hidden, unhidden, near completion, done, etc)
 * Numeric achievements should have a progress bar
 *
 * have a little console that outputs in-depth info about new tiles in ASCII
 *
 * console should output facts about special numbers of alpha bits
 */
//NUMBER IDEAS
/*
 * 1! : 1 bit
 * 2! : 2 bits
 * 3! : 6 bits (it's a factorial, not an exclamation point)
 *
 *
 * 42
 * 22, 333, 4444 ... 999999999
 *
 * 121, 12321, 1234321 ... 12345678987654321
 *
 * 314, 314159, 314159265, ...
 *
 * 10, 100, 1000 ...
 *
 * powers of 2 and 3
 *
 *
 */

//ACHIEVEMENT IDEAS

/*
 * Count to 10! : (it's harder than it looks) : //10! = 3,628,800
 *
 * π²	: have 314 pi bits
 *
 * Aα, Bβ, Γγ ... Ωω : (tier unlocked: alpha, beta, etc)
 */