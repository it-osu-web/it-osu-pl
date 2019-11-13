window.addEventListener('load', function(event) {
  var options = {
    ariaLabel: 'Main Navigation',
    breakpointMinWidth: 720,
    mode: 'dualAction',
    responsiveSubmenuToggles: true,
  };
  var mainMenu = new a11yNavbar('main-nav', options);
});
