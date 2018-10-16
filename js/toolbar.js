(function() {
	var canvas = document.getElementById('drawCanvas');
	var ctx = canvas.getContext('2d');

	/* Hook is--visible to toolbar selection */
	$(document).ready(function() {
		$('#tool-bar-colors').live('click', function() {
			if ($('#hidden-toolbar-color').hasClass('is--visible')) {
				$('#hidden-toolbar-color').removeClass('is--visible');
			} else {
				$('#hidden-toolbar-color').addClass('is--visible');
			}
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