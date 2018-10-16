(function() {
	/* Canvas setup */
	var canvas = document.getElementById('drawCanvas');
	var ctx = canvas.getContext('2d');
	var color = document.querySelector(':checked').getAttribute('data-color');

	canvas.width = Math.min(document.documentElement.clientWidth, window.innerWidth || 300);
	canvas.height = Math.min(document.documentElement.clientHeight, window.innerHeight || 300);

	var isTouchSupported = 'ontouchstart' in window;
	var isPointerSupported = navigator.pointerEnabled;
	var isMSPointerSupported =  navigator.msPointerEnabled;
	
	var downEvent = isTouchSupported ? 'touchstart' : (isPointerSupported ? 'pointerdown' : (isMSPointerSupported ? 'MSPointerDown' : 'mousedown'));
	var moveEvent = isTouchSupported ? 'touchmove' : (isPointerSupported ? 'pointermove' : (isMSPointerSupported ? 'MSPointerMove' : 'mousemove'));
	var upEvent = isTouchSupported ? 'touchend' : (isPointerSupported ? 'pointerup' : (isMSPointerSupported ? 'MSPointerUp' : 'mouseup'));
	
	/* Listener for key event */
	canvas.addEventListener(downEvent, startDraw, false);
	canvas.addEventListener(moveEvent, draw, false);
	canvas.addEventListener(upEvent, endDraw, false);
	 
	ctx.strokeStyle = color;
	ctx.lineCap = ctx.lineJoin = 'round';

	ctx.lineWidth = '3';
	/* Change pen-size based on slider */
	var slider = document.getElementById('pen-size');
	slider.oninput = function() {
		ctx.lineWidth = this.value;
	}

	/* PubNub data stream */
	var channel = 'whiteboard-demo';
	var pubnub = PUBNUB.init({
	    publish_key: 'pub-c-4660625f-ec36-4097-b692-529aaacdc6db',
	    subscribe_key: 'sub-c-74c94b26-d0fe-11e8-8f2a-6ea01b4be699',
	    ssl: true
	});
	pubnub.subscribe({
	    channel: channel,
	    callback: drawFromStream
	});
	function publish(data) {
		pubnub.publish({
			channel: channel,
			message: data
		});
	}

	/* Mouse and touch events */
	document.getElementById('colorSwatch').addEventListener('click', function() {
		color = document.querySelector(':checked').getAttribute('data-color');
	}, false);

	/* Eraser */
	$(document).ready(function() {
		$('#tool-bar-eraser').live('click', function() {
			color = 'white';
		});
	})

	/* Clear canvas */
	$(document).ready(function() {
		$('#tool-bar-clear').live('click', function() {
			event.preventDefault();
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		});
	})

	function changeColor(newColor) {
		color = newColor;
	}

    /* Draw on canvas */
    function drawOnCanvas(penSize, color, plots) {
    	ctx.strokeStyle = color;
    	ctx.lineWidth = penSize
		ctx.beginPath();
		ctx.moveTo(plots[0].x, plots[0].y);

    	for(var i=1; i<plots.length; i++) {
	    	ctx.lineTo(plots[i].x, plots[i].y);
	    }
	    ctx.stroke();
    }

    /* Draw object from stream to peer's canvas */
    function drawFromStream(message) {
		if(!message || message.plots.length < 1) return;
		drawOnCanvas(message.penSize, message.color, message.plots);
		ctx.beginPath();
    }

    var isActive = false;
    var plots = [];

    /* Draw object on host canvas */
	function draw(e) {
		e.preventDefault(); // prevent continuous touch event process e.g. scrolling
	  	if(!isActive) return;

    	var x = isTouchSupported ? (e.targetTouches[0].pageX - canvas.offsetLeft) : (e.offsetX || e.layerX - canvas.offsetLeft);
    	var y = isTouchSupported ? (e.targetTouches[0].pageY - canvas.offsetTop) : (e.offsetY || e.layerY - canvas.offsetTop);
    	
    	plots.push({x: (x << 0), y: (y << 0)}); // round numbers for touch screens

    	drawOnCanvas(ctx.lineWidth, color, plots);
	}
	
	/* Trigger start draw action on key down */
	function startDraw(e) {
	  	e.preventDefault();
	  	isActive = true;
	}
	
	/* Trigger end draw action on key up */
	function endDraw(e) {
	  	e.preventDefault();
	  	isActive = false;

		pubnub.publish({
		    channel: channel,
		    message: {
		    	penSize: ctx.lineWidth,
		    	color: ctx.strokeStyle,
		        plots: plots // your array goes here
		    } 
		});

	  	plots = [];
	}
})();
