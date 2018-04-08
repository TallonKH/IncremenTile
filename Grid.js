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

Grid.counter = 0;