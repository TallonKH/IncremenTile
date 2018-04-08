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