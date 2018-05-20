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

function calcMousePos2(event) {
	return new Point((event.clientX + window.pageXOffset - canvas.offsetLeft), (event.clientY + window.pageYOffset - canvas.offsetTop));
	// return new Point((event.clientX + window.pageXOffset), (event.clientY + window.pageYOffset));
}

document.onkeypress = function(event){
	if(event.ctrlKey){
		switch(event.key){
			case '-':{
				let center = 0.5 * canvasSize
				changeZoom(zoomAmount * 200, new Point(center,center));
				break
			}
			case '=':{
				let center = 0.5 * canvasSize
				changeZoom(zoomAmount * -200, new Point(center,center));
				break
			}
		}
	}
}

function changeZoom(change, center){
	let prevZoom = zoomAmount;
	zoomCounter -= change;
	zoomCounter = Math.max(Math.min(zoomCounter, 1000), -400);
	zoomAmount = 1 + zoomCounter/500;
	diff = (zoomAmount - prevZoom);
	viewportPos = viewportPos.addp(center.addp(viewportPos).divide1(prevZoom).multiply1(diff))
}

canvas.addEventListener('mousewheel', function(event) {
	if (event.ctrlKey) {
		changeZoom(event.deltaY, windowMousePos);
	} else {
		viewportPos = viewportPos.add2(event.deltaX, event.deltaY);
	}
	event.preventDefault();
	return false;
}, false);

canvas.onmousemove = function(event) {
	currentMousePos = calcMousePos(event);
	windowMousePos = calcMousePos2(event)
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
		zoomAmount = 1
		viewportPos = new Point(-canvasSize / 20, -canvasSize / 20);
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