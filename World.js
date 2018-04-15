class World {
	constructor(name) {
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

	onTick() {
		while (this.actorsPendingExit.length > 0) {
			this.exitNow(this.actorsPendingExit.pop());
		}
		while (this.actorsPendingEnter.length > 0) {
			this.enterNow(this.actorsPendingEnter.pop());
		}

		for (let i = 0; i < this.actorsPendingTick.length; i++) {
			this.actorsPendingTick[i].onTick();
		}
	}
}