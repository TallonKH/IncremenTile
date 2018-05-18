function generateTileTypes(types, charDict) {
	let tile = tile_empty;
	tile.draw = function(grid, data, renderX, renderY, renderScale) {
		ctx.fillStyle = "#eeeeee";
		ctx.fillRect(renderX + (0.2 * renderScale), renderY + (0.2 * renderScale), renderScale * 0.6, renderScale * 0.6);
	}
	tile.initialData = function(x, y) {
		return {};
	};
	standardTilePush(tile);

	tile = tile_gen_alpha;
	tile.tickable = true;
	tile.clickable = true;
	tile.associatedMaterial = mat_gen_alpha;
	tile.draw = function(grid, data, renderX, renderY, renderScale) {
		misc = [grid, data, renderX, renderY, renderScale];
		ctx.fillStyle = fillColorAlpha;
		this.drawBasicRect(misc);
		ctx.strokeStyle = lineColorAlpha;
		this.drawOutline(misc, 0.02);

		let cdVal = Math.max(0, data["cooldown"][0]);

		ctx.fillStyle = (cdVal == 0) ? activeColor : inactiveColor;
		this.drawText(misc, 'α', 0.4);

		let cdPercent = 1 - cdVal / data["max_cooldown"];
		this.drawBasicTimer(misc, 0.4, cdPercent);
	}
	tile.onTick = function(grid, data) {
		let cooldown = data["cooldown"];
		if (cooldown[0] > 0) {
			cooldown[0] --;
			grid.requestNextTick(data["coord"]);
		}
	}
	tile.created = function(grid, data) {
		grid.requestNextTick(data["coord"]);
	}
	tile.simulatedClick = function(grid, data) {
		return this.onMouseClicked(grid, data);
	}
	tile.onMouseClicked = function(grid, data) {
		let cooldown = data["cooldown"];
		if (cooldown[0] <= 0) {
			mat_bit_alpha.increment(1);
			cooldown[0] = data["max_cooldown"];
			grid.requestNextTick(data["coord"]);
			return true;
		}else{
			return false;
		}
	}
	tile.initialData = function(grid, x, y) {
		let cd = 32;
		return {
			"coord": new Point(x, y),
			"max_cooldown": cd,
			"pendingTick": false,
			"cooldown": [cd]
		};
	};
	standardTilePush(tile);

	tile = tile_timer_alpha;
	tile.tickable = true;
	tile.clickable = true;
	tile.preserveInfo = true;
	tile.associatedMaterial = mat_timer_alpha;
	tile.draw = function(grid, data, renderX, renderY, renderScale) {
		misc = [grid, data, renderX, renderY, renderScale];
		ctx.fillStyle = fillColorAlpha;
		this.drawBasicRect(misc);
		ctx.strokeStyle = lineColorAlpha;
		this.drawOutline(misc, 0.02);

		let cdVal = data["cooldown"][0];
		let clicks = data["clicks"][0];

		ctx.fillStyle = (clicks == 0) ? inactiveColor : activeColor;
		this.drawText(misc, clicks, 0.4);

		let cdPercent = 1 - cdVal / data["max_cooldown"];
		let clickPercent = clicks / data["max_clicks"];
		this.drawBasicTimer(misc, 0.4, cdPercent);
		this.drawBasicTimer(misc, 0.3, clickPercent);
	}
	tile.onTick = function(grid, data) {
		let cooldown = data["cooldown"];
		let pendingRefreshes = data["pendingRefreshes"];

		if(cooldown[0] > 0){
			cooldown[0]--;
		}else{
			if(data["clicks"][0] > 0){
				let adj = data["coord"].add2(0,-1);
				let t = grid.getTile(adj);
				if(t.simulatedClick(grid,grid.getData(adj))){
					data["clicks"][0]--;
				}
				cooldown[0] = data["max_cooldown"];
			}
		}
		if(data["clicks"][0] > 0){
			grid.requestNextTick(data["coord"]);
		}
	}
	tile.created = function(grid, data) {
		grid.requestNextTick(data["coord"]);
	}
	tile.saveInfo = function(data){
		console.log('SAVED')
		console.log(data["clicks"][0]);
		return data["clicks"][0];
	}
	tile.loadInfo = function(data, json){
		data["clicks"] = [json];
	}
	tile.simulatedClick = function(grid, data) {
		if(data["clicks"][0] == 0){
			return this.onMouseClicked(grid,data)
		}else{
			return false;
		}
	}
	tile.onMouseClicked = function(grid, data) {
		const max = data["max_clicks"];
		let clicks = data["clicks"];

		if (clicks[0] < max) {
			clicks[0] = max;
			if(clicks[0] == 0){
				data["cooldown"][0] = data["max_cooldown"];
			}
			grid.requestNextTick(data["coord"]);
			return true;
		}
	}
	tile.initialData = function(grid, x, y) {
		let cd = 64;
		let clicks = 4;
		return {
			"max_cooldown": cd,
			"pendingTick": false,
			"max_clicks": clicks,
			"coord": new Point(x, y),
			"clicks": [clicks],
			"cooldown": [cd]
		};
	};
	standardTilePush(tile);

	tile = tile_pulser_alpha;
	tile.tickable = true;
	tile.clickable = true;
	tile.associatedMaterial = mat_pulser_alpha;
	tile.draw = function(grid, data, renderX, renderY, renderScale) {
		misc = [grid, data, renderX, renderY, renderScale];
		ctx.fillStyle = fillColorAlpha;
		this.drawBasicRect(misc);
		ctx.strokeStyle = lineColorAlpha;
		this.drawOutline(misc, 0.02);

		let cdVal = Math.max(0, data["cooldown"][0]);

		ctx.fillStyle = (cdVal == 0) ? activeColor : inactiveColor;

		let cdPercent = 1 - cdVal / data["max_cooldown"];
		this.drawBasicTimer(misc, 0.4, cdPercent);

		this.drawPulser(misc);
	}
	tile.onTick = function(grid, data) {
		let cooldown = data["cooldown"];
		if (cooldown[0] > 0) {
			cooldown[0]--;
			grid.requestNextTick(data["coord"]);
		}
	}
	tile.created = function(grid, data) {
		grid.requestNextTick(data["coord"]);
	}
	tile.simulatedClick = function(grid, data) {
		return this.onMouseClicked(grid, data)
	}
	tile.onMouseClicked = function(grid, data) {
		let cooldown = data["cooldown"];
		let success = false;
		if (cooldown[0] <= 0) {
			cooldown[0] = data["max_cooldown"];
			let adj = grid.getAdjacentCoords(data["coord"]);
			for (let i = 0; i < adj.length; i++) {
				let otherCoord = adj[i];
				let otherType = grid.getTile(otherCoord);
				if (otherType.clickable) {
					success |= otherType.simulatedClick(grid, grid.getData(otherCoord));
				}
			}
			grid.requestNextTick(data["coord"]);
		}
		return success;
	}
	tile.initialData = function(grid, x, y) {
		let cd = 32;
		return {
			"coord": new Point(x, y),
			"max_cooldown": cd,
			"pendingTick": false,
			"cooldown": [cd]
		};
	};
	standardTilePush(tile);

	function standardTilePush(){
		tile.char = charset[types.length];
		charDict[tile.char] = tile;
		types.push(tile);
	}
}