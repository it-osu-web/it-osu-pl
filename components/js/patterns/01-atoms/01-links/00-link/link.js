// This is not needed in Drupal if the extlink module is being used.
(function ($) {
	$('a.link').each(function () {
		if ($(this).hasClass('link--ext')) {
			$(this).append('<i class="fas fa-external-link-alt"></i>');
		}
		if ($(this).hasClass('link--mailto')) {
			$(this).append('<i class="fas fa-envelope"></i>');
		}
	});
})(jQuery);
