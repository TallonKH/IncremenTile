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

canvas.onmousemove = function(event) {
	currentMousePos = calcMousePos(event);
	lastMouseDelta = lastMousePos.subtractp(currentMousePos);
	totalMouseDelta = mouseDownPos.subtractp(currentMousePos);
	//do stuff
	lastMousePos = currentMousePos;
}

function calcMousePos(event) {
	return new Point((event.clientX - canvas.offsetLeft + window.pageXOffset) / zoom + viewportPos.x, (event.clientY - canvas.offsetTop + window.pageYOffset) / zoom + viewportPos.y);
}

function calcMousePos2(event) {
	return new Point((event.clientX - canvas.offsetLeft + window.pageXOffset) / zoom, (event.clientY - canvas.offsetTop + window.pageYOffset) / zoom);
}
