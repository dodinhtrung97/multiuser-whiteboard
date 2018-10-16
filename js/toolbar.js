(function() {
	var canvas = document.getElementById('drawCanvas');
	var ctx = canvas.getContext('2d');

	/* Hook is--visible to toolbar color selector */
	$(document).ready(function() {
		$('#tool-bar-colors').live('click', function() {
			if ($('#hidden-toolbar-color').hasClass('is--visible')) {
				$('#hidden-toolbar-color').removeClass('is--visible');
			} else {
				$('#hidden-toolbar-pen').removeClass('is--visible');
				$('#hidden-toolbar-color').addClass('is--visible');
			}
		});
	})

	/* Hook is--visible to toolbar pen size selection */
	$(document).ready(function() {
		$('#tool-bar-pen').live('click', function() {
			if ($('#hidden-toolbar-pen').hasClass('is--visible')) {
				$('#hidden-toolbar-pen').removeClass('is--visible');
			} else {
				$('#hidden-toolbar-color').removeClass('is--visible');
				$('#hidden-toolbar-pen').addClass('is--visible');
			}
		});
	})

	/* Hook is--visible to toolbar eraser size selection */
	$(document).ready(function() {
		$('#tool-bar-eraser').live('click', function() {
			$('#hidden-toolbar-color').removeClass('is--visible');
			$('#hidden-toolbar-pen').removeClass('is--visible');
		});
	})

	/* Clear canvas */
	$(document).ready(function() {
		$('#tool-bar-clear').live('click', function() {
			event.preventDefault();
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		});
	})
})();