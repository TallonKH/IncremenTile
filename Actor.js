let actorTypeDict = {};
class Actor {
	constructor() {
		this.pos = new Point(0, 0);
		this.scale = 10;
		this.type = null;
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
	saveInfo(info){
		info['type'] = this.type;
		if(this.pos.x != 0){
			info['x'] = this.pos.x;
		}
		if(this.pos.y != 0){
			info['y'] = this.pos.y;
		}
	};

	loadInfo(info){
		this.pos = new Point(info["x"] || 0, info["y"] || 0);
	}
}

class BGActor extends Actor {
	constructor() {
		super();
		this.type = "background"
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
actorTypeDict["background"] = BGActor;

