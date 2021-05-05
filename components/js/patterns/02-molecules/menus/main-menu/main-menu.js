var minWidth = 640;

// Applies a11y navbar script.
window.addEventListener('load', function (event) {
  var options = {
    ariaLabel: 'Main Navigation',
    breakpointMinWidth: minWidth,
    mode: 'dualAction',
    responsiveSubmenuToggles: true,
  };
  var mainMenu = new a11yNavbar('main-nav', options);
});

// Removes grid container for mobile menu.
var windowWidth = $(window).width();

(function ($) {

  var detectMobile = function () {
    if (windowWidth < minWidth) {
      $('.layout__inner--primary-menu').removeClass('grid-container');
    }
  }

  // Call function on page load and resize.
  // detectMobile();
  
  // $(window).on('resize', function() {
  //   detectMobile();
  // });

})(jQuery);
