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

const clickOpacity = {
	OPAQUE: 2, // capture mouse and block things behind
	TRANSLUCENT: 1, // capture mouse but let things behind receive
	TRANSPARENT: 0 // ignore mouse input
}