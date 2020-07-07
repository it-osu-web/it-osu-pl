(function ($) {
	// Toggle plus and minus for details elements.
	var summary = $('.summary--plus');

	summary.click(function () {
		var parent = this.closest('details');
		var control = $('.pm-control', this);

		if (parent.hasAttribute('open')) {
			control.removeClass('minus').addClass('plus');
		} else {
			control.removeClass('plus').addClass('minus');
		}
	});

	// Function to open details if corresponding hash is in the url.
	var openDetails = function () {
		var hashValue = location.hash;
		var detailsElement = $('details');

		detailsElement.each(function () {
			var detailsSummary = $('summary', this);
			var detailsId = $(this).attr('id');
			var detailsHash = '#' + detailsId;

			// If detailsHash matches hashValue, open details element.
			if (detailsHash == hashValue) {
				$(this).attr('open', true);
				detailsSummary.attr({
					'aria-expanded': true,
					'aria-pressed': true,
				});
			} else {
				$(this).attr('open', false);
				detailsSummary.attr({
					'aria-expanded': false,
					'aria-pressed': false,
				});
			}
		});
	};

	// Run on initial page load if there is a hash is in the url.
	if (window.location.hash) {
		openDetails();
	}
	// Also listen for hash changes.
	window.addEventListener('hashchange', openDetails, false);
})(jQuery);
