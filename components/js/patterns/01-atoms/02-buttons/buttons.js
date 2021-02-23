// This is not needed in Drupal if the extlink module is being used.
(function ($) {
	$('.button').each(function () {
		if ($(this).hasClass('ext')) {
			$(this).append('<span class="visually-hidden">external</span><i class="fas fa-external-link-alt"></i>');
		}
		if ($(this).hasClass('mailto')) {
			$(this).append('<i class="fas fa-envelope"></i>');
		}
	});
})(jQuery);
