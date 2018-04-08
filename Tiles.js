
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