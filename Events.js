$(function(){
	// make sure this happens after page is fully loaded
	// to prevent saving too early

	window.onbeforeunload = function(e) {
		if (pendingReset) {
			localStorage.clear();
		} else {
			save();
		}
	};
});

window.onresize = fixScreenDims;


canvas.onmousedown = function(event) {
	totalMouseDelta = new Point(0, 0);
	mouseDown = true;
	mouseDownPos = calcMousePos(event);
	mouseDownCaught = currentWorld.onMouseDown(mouseDownPos);
}

canvas.onmouseup = function(event) {
	mouseDown = false;
	isMouseDragging = false;
	mouseUpCaught = currentWorld.onMouseUp(calcMousePos(event));
}

document.onkeydown = function(event) {

}

canvas.addEventListener('mousewheel', function(event) {
	if (event.ctrlKey) {
		let prev = zoomAmount;
		zoomCounter -= event.deltaY;
		zoomCounter = Math.max(Math.min(zoomCounter, 1000), 0);
		zoomAmount = Math.pow(10, zoomCounter / 1000);
		let diff = (zoomAmount - prev) / canvasSize;
		viewportPos = viewportPos.addp(new Point(0.5, 0.5).multiply1(diff));
	} else {
		viewportPos = viewportPos.add2(event.deltaX / zoomAmount / 10, event.deltaY / zoomAmount / 10);
	}
	event.preventDefault();
	return false;
}, false);

canvas.onmousemove = function(event) {
	currentMousePos = calcMousePos(event);
	lastMouseDelta = lastMousePos.subtractp(currentMousePos);
	totalMouseDelta = mouseDownPos.subtractp(currentMousePos);
	//do stuff
	lastMousePos = currentMousePos;
}



$(function(){
	$(".stackbutton#info").click(function(e) {
		alert("[insert info]");
	});
	$(".stackbutton#delete").click(function(e) {

	});

	$(".stackbutton#recenter").click(function(){
		viewportPos = new Point(-5,-5);
	})

	getChildDivById(buttonStack, "download").onmousedown = function() {
		prompt("This text contains your current save data:\n", JSON.stringify(exportData()));
	}
	getChildDivById(buttonStack, "upload").onmousedown = function() {

	}
	clearButton = getChildDivById(buttonStack, "clear")
	clearButton.onmousedown = function() {
		if (pendingReset) {
			alert("Reset cancelled.");
			clearButton.removeAttribute("active");
			pendingReset = false;
		} else {
			if (confirm("This will reset the game next time you open it. Are you sure?")) {
				alert("Ok. Refresh or reopen the page to reset the game. Click the icon again to cancel.");
				pendingReset = true;
				clearButton.setAttribute("active", true);
			}
		}
	}
});

function calcMousePos(event) {
	return new Point((event.clientX - canvas.offsetLeft + window.pageXOffset) / zoom + viewportPos.x, (event.clientY - canvas.offsetTop + window.pageYOffset) / zoom + viewportPos.y);
}

function calcMousePos2(event) {
	return new Point((event.clientX - canvas.offsetLeft + window.pageXOffset) / zoom, (event.clientY - canvas.offsetTop + window.pageYOffset) / zoom);
}