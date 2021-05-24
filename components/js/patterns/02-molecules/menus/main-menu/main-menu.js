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
