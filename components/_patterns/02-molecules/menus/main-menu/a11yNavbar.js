/**
 * @file a11yNavbar.js
 *
 * A11y Navbar Copyright (c) 2019 Joe Bondra
 */

class a11yNavbar {
  constructor(id, options = {}) {
    // Define members.
    this._keyCode = {
      TAB: 9,
      ENTER: 13,
      ESC: 27,
      SPACE: 32,
      END: 35,
      HOME: 36,
      ARROW_LEFT: 37,
      ARROW_UP: 38,
      ARROW_RIGHT: 39,
      ARROW_DOWN: 40,
    };

    this._touchmoveActive = false; // Used to determine if user is currently scrolling via touch.

    // Merge user-defined options with default options.
    this._defaultOptions = {
      windowObj: window,
      domObj: document,
      ariaLabel: '',
      hoverintent: hoverintent,
      orientation: 'horizontal',
      breakpointMinWidth: 500,
      responsiveToggleText: 'Menu',
      responsiveSubmenuToggles: false,
      mode: 'standard',
    };
    this._options = Object.assign(this._defaultOptions, options);

    this._id = id;
    this._navElem = this._options.domObj.getElementById(this._id);
    this._menubarMenuitems = [];
    this._currentMenubarIndex = 0;
    this._currentMenuitem = null;

    // Reset navbar when navbar loses focus.
    this._navElem.addEventListener(
      'focusout',
      this.handleFocusoutNavElem.bind(this),
    );

    // Reset navbar when touchend event occurs outside navbar.
    this._options.domObj.addEventListener(
      'touchend',
      this.handleTouchendDocument.bind(this),
    );
    this._navElem.addEventListener(
      'touchend',
      this.handleTouchendNavElem.bind(this),
    );

    if (this._options.mode == 'dualAction') {
      // Add element to explain alternate instructions for mode dualAction.
      this._menubarInstructions = this._options.domObj.createElement('div');
      this._menubarInstructions.innerHTML =
        '<p>Use <strong>Enter</strong> or <strong>Space</strong> to activate links.</p>' +
        '<p>Use appropriate arrow key to open or close submenus.</p>';
      this._menubarInstructions.setAttribute(
        'id',
        this._id + '-menubar-instructions',
      );
      this._menubarInstructions.classList.add('a11y-navbar-instructions');
      this._navElem.insertBefore(
        this._menubarInstructions,
        this._navElem.firstElementChild,
      );
    }

    // Add/Remove toggle button based on breakpointMinWidth.
    this._menubarToggle = this._options.domObj.createElement('button');
    this._menubarToggle.textContent = this._options.responsiveToggleText;
    this._menubarToggle.setAttribute('id', this._id + '-toggle');
    this._menubarToggle.setAttribute('aria-expanded', 'false');
    this._menubarToggle.setAttribute('aria-controls', this._id);
    this._menubarToggle.classList.add('a11y-navbar-toggle');
    let menuIcon = this._options.domObj.createElement('span');
    menuIcon.setAttribute('aria-hidden', 'true');
    this._menubarToggle.appendChild(menuIcon);
    this._menubarToggle.addEventListener(
      'click',
      this.handleClickMenubarToggle.bind(this),
    );

    this._options.windowObj.addEventListener(
      'resize',
      this.handleMenubarResize.bind(this),
    );

    // TODO: Add configurable defaults for class names.

    // Set up aria roles and attributes.
    this._navElem.setAttribute('aria-label', this._options.ariaLabel);
    this._navElem.classList.add('a11y-navbar');

    let menubar = this._navElem.querySelector('ul');

    menubar.setAttribute('aria-label', this._options.ariaLabel);
    menubar.classList.add('a11y-navbar-menubar');
    menubar.classList.add(
      'a11y-navbar-orientation-' + this._options.orientation,
    );

    if (this._options.orientation == 'horizontal') {
      menubar.setAttribute('role', 'menubar');
    } else if (this._options.orientation == 'vertical') {
      // aria-orientation is implicitly 'vertical' for menus, and not supported on role=menubar.
      menubar.setAttribute('role', 'menu');
    }

    // Add hoverintent functionality (or mouse events if hoverintent not available).
    if (this._options.hoverintent) {
      // Hoverintent in environment.
      let options = {
        timeout: 900,
        interval: 50,
      };

      this._options
        .hoverintent(
          menubar,
          function(event) {},
          this.handleMouseoutMenubar.bind(this),
        )
        .options(options);
    } else {
      // Default mouse events.
      menubar.addEventListener(
        'mouseout',
        this.handleMouseoutMenubar.bind(this),
      );
    }

    // For menubar menuitems specifically.
    let menubarMenuitems = menubar.children;

    for (let i = 0; i < menubarMenuitems.length; i++) {
      let menubarMenuitem = menubarMenuitems[i].querySelector('a');
      menubarMenuitem.classList.add('a11y-navbar-menuitem');

      // collect these as an Array or something and store in the class.
      this._menubarMenuitems[i] = menubarMenuitem;

      // Add keydown handler (bound to a11yNavbar instance).
      menubarMenuitem.addEventListener(
        'keydown',
        this.handleKeydownMenubar.bind(this),
      );
    }

    // Add keydown handler to submenu menuitems (bound to a11yNavbar instance).
    let submenuMenuitems = this._navElem.querySelectorAll('a + ul > li > a');

    for (let i = 0; i < submenuMenuitems.length; i++) {
      submenuMenuitems[i].addEventListener(
        'keydown',
        this.handleKeydownSubmenu.bind(this),
      );

      // Add handler to open parent menuitems if menu was closed by non-keyboard interaction.
      submenuMenuitems[i].addEventListener(
        'focusin',
        this.handleFocusinMenuitem.bind(this),
      );
    }

    // Attributes for all menuitems.
    let menuitems = menubar.querySelectorAll('li > a');

    for (let j = 0; j < menuitems.length; j++) {
      menuitems[j].setAttribute('role', 'menuitem');
      menuitems[j].setAttribute('tabindex', '-1');

      // Add hoverintent functionality (or mouse events if hoverintent not available).
      if (this._options.hoverintent) {
        // Hoverintent in environment.
        let options = {
          timeout: 500,
          interval: 100,
        };

        this._options
          .hoverintent(
            menuitems[j],
            this.handleMouseoverMenuitem.bind(this),
            function(event) {},
          )
          .options(options);
      } else {
        // Default mouse events.
        menuitems[j].addEventListener(
          'mouseover',
          this.handleMouseoverMenuitem.bind(this),
        );
      }

      // @see https://w3c.github.io/touch-events/#mouse-events
      // Override click event for all menuitems.
      menuitems[j].addEventListener(
        'click',
        this.handleClickMenuitem.bind(this),
      );

      // Override touch events for all menuitems.
      menuitems[j].addEventListener(
        'touchstart',
        this.handleTouchstartMenuitem.bind(this),
      );
      menuitems[j].addEventListener(
        'touchmove',
        this.handleTouchmoveMenuitem.bind(this),
      );
      menuitems[j].addEventListener(
        'touchend',
        this.handleTouchendMenuitem.bind(this),
      );
    }

    // Attributes for all submenus.
    let submenus = menubar.querySelectorAll('li > a + ul');

    for (let k = 0; k < submenus.length; k++) {
      // Get aria-label from anchor sibing.
      let submenuLiElem = submenus[k].parentNode;
      let aElem = submenuLiElem.querySelector('a');
      let aElemText = aElem.textContent;

      aElem.setAttribute('aria-haspopup', 'true');
      aElem.setAttribute('aria-expanded', 'false');

      submenus[k].setAttribute('id', this._id + '-submenu-' + k);
      submenus[k].setAttribute('role', 'menu');
      submenus[k].setAttribute('aria-label', aElemText);
      submenus[k].classList.add('a11y-navbar-submenu');
      submenus[k].classList.add('a11y-navbar-menu-closed');
    }

    // All li elements should have an aria role of "none".
    let liElem = menubar.querySelectorAll('li');

    for (let l = 0; l < liElem.length; l++) {
      liElem[l].setAttribute('role', 'none');
    }

    // First menubar menuitem should have tabindex 0.
    this._menubarMenuitems[0].setAttribute('tabindex', '0');

    if (this._options.mode == 'dualAction') {
      // Add instructions for dualAction mode to first menubar menuitem.
      this._menubarMenuitems[0].setAttribute(
        'aria-describedby',
        this._id + '-menubar-instructions',
      );
    }

    // First menubar menuitem should be the current menuitem.
    this._currentMenuitem = this._menubarMenuitems[0];

    // Check if the menu should be resized on page load.
    this.menubarResize();
  }

  destroy() {
    // Remove all attributes/behaviors, etc. from constructor.
  }

  // Event Handlers -----------------------------------------------------

  handleMenubarResize(event) {
    if (event.defaultPrevented) {
      return;
    }

    this.menubarResize();
  }

  handleClickMenubarToggle(event) {
    if (event.defaultPrevented) {
      return;
    }

    if (this._navElem.classList.contains('a11y-navbar-closed')) {
      this._navElem.classList.remove('a11y-navbar-closed');
      this._navElem.classList.add('a11y-navbar-open');
      this._menubarToggle.setAttribute('aria-expanded', 'true');
    } else if (this._navElem.classList.contains('a11y-navbar-open')) {
      this._navElem.classList.remove('a11y-navbar-open');
      this._navElem.classList.add('a11y-navbar-closed');
      this._menubarToggle.setAttribute('aria-expanded', 'false');
    }
  }

  handleKeydownMenubar(event) {
    if (event.defaultPrevented) {
      return;
    }

    /*
     When items in a menubar are arranged vertically and items in menu containers are arranged horizontally:
      -Down Arrow performs as Right Arrow, and vice versa.
      -Up Arrow performs as Left Arrow, and vice versa.
     */

    let preventDefault = false; // Flag to prevent the keypress from doing what it usually would do.
    let menuitem = event.target;
    let key = this.normalizeKey(event.key || event.keyCode);
    let mode = this._options.mode;

    if (
      (key == this._keyCode.SPACE && mode == 'standard') ||
      (key == this._keyCode.ENTER && mode == 'standard') ||
      (this._options.orientation == 'horizontal' &&
        key == this._keyCode.ARROW_DOWN) ||
      (this._options.orientation == 'vertical' &&
        key == this._keyCode.ARROW_RIGHT)
    ) {
      this.closeAllSubmenus();
      if (this.hasSubmenu(menuitem)) {
        // Opens submenu and moves focus to first item in the submenu.
        this.openSubmenu(menuitem);
        let firstMenuitem = menuitem.parentNode
          .querySelector('ul[role=menu] > li')
          .querySelector('a');

        if (firstMenuitem != null) {
          firstMenuitem.focus();
          this.updateCurrentMenuitem(firstMenuitem);
        }
      }
      preventDefault = true;
    } else if (
      (key == this._keyCode.SPACE && mode == 'dualAction') ||
      (key == this._keyCode.ENTER && mode == 'dualAction')
    ) {
      // Activates menu item, causing the link to be activated.
      this.performClick(menuitem);
      preventDefault = true;
    } else if (
      (this._options.orientation == 'horizontal' &&
        key == this._keyCode.ARROW_RIGHT) ||
      (this._options.orientation == 'vertical' &&
        key == this._keyCode.ARROW_DOWN)
    ) {
      /*
        -Moves focus to the next item in the menubar.
        -If focus is on the last item, moves focus to the first item.
       */
      let nextMenubarIndex =
        this._currentMenubarIndex + 1 >= this._menubarMenuitems.length
          ? 0
          : this._currentMenubarIndex + 1;
      let nextMenubarItem = this._menubarMenuitems[nextMenubarIndex];

      nextMenubarItem.focus();
      this._currentMenubarIndex = nextMenubarIndex;
      this.updateCurrentMenuitem(nextMenubarItem);
      preventDefault = true;
    } else if (
      (this._options.orientation == 'horizontal' &&
        key == this._keyCode.ARROW_LEFT) ||
      (this._options.orientation == 'vertical' && key == this._keyCode.ARROW_UP)
    ) {
      /*
        -Moves focus to the previous item in the menubar.
        -If focus is on the first item, moves focus to the last item.
       */
      let prevMenubarIndex =
        this._currentMenubarIndex - 1 < 0
          ? this._menubarMenuitems.length - 1
          : this._currentMenubarIndex - 1;
      let prevMenubarItem = this._menubarMenuitems[prevMenubarIndex];

      prevMenubarItem.focus();
      this._currentMenubarIndex = prevMenubarIndex;
      this.updateCurrentMenuitem(prevMenubarItem);
      preventDefault = true;
    } else if (
      (this._options.orientation == 'horizontal' &&
        key == this._keyCode.ARROW_UP) ||
      (this._options.orientation == 'vertical' &&
        key == this._keyCode.ARROW_LEFT)
    ) {
      // Opens submenu and moves focus to last item in the submenu.
      if (this.hasSubmenu(menuitem)) {
        this.closeAllSubmenus();
        this.openSubmenu(menuitem);
        let lastMenuitem = menuitem.parentNode.querySelector('ul[role=menu]')
          .lastElementChild.firstElementChild;
        lastMenuitem.focus();
        this.updateCurrentMenuitem(lastMenuitem);
      }
      preventDefault = true;
    } else if (key == this._keyCode.HOME) {
      // Moves focus to first item in the menubar.
      let firstMenubarItem = this._menubarMenuitems[0];
      firstMenubarItem.focus();
      this.updateCurrentMenuitem(firstMenubarItem);
      preventDefault = true;
    } else if (key == this._keyCode.END) {
      // Moves focus to last item in the menubar.
      let lastMenubarItem = this._menubarMenuitems[
        this._menubarMenuitems.length - 1
      ];
      lastMenubarItem.focus();
      this.updateCurrentMenuitem(lastMenubarItem);
      preventDefault = true;
    } else {
      // TODO: Consider adding optional character handling.
    }

    if (preventDefault) {
      // The following statements will stop the keys from doing stuff.
      event.stopPropagation();
      event.preventDefault();
    }
  }

  handleKeydownSubmenu(event) {
    if (event.defaultPrevented) {
      return;
    }

    let preventDefault = false; // Flag to prevent the keypress from doing what it usually would do.
    let menuitem = event.target;
    let key = this.normalizeKey(event.key || event.keyCode);
    let mode = this._options.mode;

    if (
      (key == this._keyCode.SPACE || key == this._keyCode.ENTER) &&
      mode == 'standard'
    ) {
      if (this.hasSubmenu(menuitem)) {
        // Open the submenu and place focus on the first item.
        this.openSubmenu(menuitem);
        let firstMenuitem = menuitem.parentNode
          .querySelector('ul[role=menu] > li')
          .querySelector('a');

        if (firstMenuitem != null) {
          firstMenuitem.focus();
          this.updateCurrentMenuitem(firstMenuitem);
        }
        preventDefault = true;
      } else {
        // Activates menu item, causing the link to be activated.
        this.performClick(menuitem);
        preventDefault = true;
      }
    } else if (
      (key == this._keyCode.SPACE || key == this._keyCode.ENTER) &&
      mode == 'dualAction'
    ) {
      // Activates menu item, causing the link to be activated.
      this.performClick(menuitem);
      preventDefault = true;
    } else if (key == this._keyCode.ESC) {
      /*
        -Closes submenu.
        -Moves focus to parent menubar item.
       */
      let parentMenuitem = menuitem.parentNode.parentNode.parentNode.querySelector(
        'a[role=menuitem]',
      );
      this.closeSubmenu(parentMenuitem);
      parentMenuitem.focus();
      this.updateCurrentMenuitem(parentMenuitem);
      preventDefault = true;
    } else if (key == this._keyCode.ARROW_RIGHT) {
      /*
        -If focus is on an item with a submenu, opens the submenu and places focus on the first item.
        -If focus is on an item that does not have a submenu:
            -Closes submenu.
            -Moves focus to next item in the menubar.
            -Opens submenu of newly focused menubar item, keeping focus on that parent menubar item.
       */
      if (this.hasSubmenu(menuitem)) {
        let firstSubmenuItem = menuitem.parentNode
          .querySelector('a + ul')
          .querySelector('li > a');
        this.openSubmenu(menuitem);
        firstSubmenuItem.focus();
        this.updateCurrentMenuitem(firstSubmenuItem);
      } else {
        this.closeAllSubmenus();

        let nextMenubarIndex =
          this._currentMenubarIndex + 1 >= this._menubarMenuitems.length
            ? 0
            : this._currentMenubarIndex + 1;
        let nextMenubarItem = this._menubarMenuitems[nextMenubarIndex];

        nextMenubarItem.focus();
        this.openSubmenu(nextMenubarItem);
        this._currentMenubarIndex = nextMenubarIndex;
        this.updateCurrentMenuitem(nextMenubarItem);
      }
      preventDefault = true;
    } else if (key == this._keyCode.ARROW_LEFT) {
      /*
        -Closes submenu and moves focus to parent menu item.
        -If parent menu item is in the menubar, also:
            -moves focus to previous item in the menubar.
            -Opens submenu of newly focused menubar item, keeping focus on that parent menubar item.
       */
      let submenuParentMenuitem = menuitem.parentNode.parentNode.parentNode.querySelector(
        'a[role=menuitem]',
      );
      this.closeSubmenu(submenuParentMenuitem);
      submenuParentMenuitem.focus();
      this.updateCurrentMenuitem(submenuParentMenuitem);

      if (this._currentMenuitem.classList.contains('a11y-navbar-menuitem')) {
        let prevMenubarIndex =
          this._currentMenubarIndex - 1 < 0
            ? this._menubarMenuitems.length - 1
            : this._currentMenubarIndex - 1;
        let prevMenubarItem = this._menubarMenuitems[prevMenubarIndex];

        prevMenubarItem.focus();
        this.openSubmenu(prevMenubarItem);
        this._currentMenubarIndex = prevMenubarIndex;
        this.updateCurrentMenuitem(prevMenubarItem);
      }
      preventDefault = true;
    } else if (key == this._keyCode.ARROW_DOWN) {
      /*
        -Moves focus to the next item in the submenu.
        -If focus is on the last item, moves focus to the first item.
       */
      let nextSubmenuItem = undefined;
      let nextSubmenuLiElem = menuitem.parentNode.nextElementSibling;
      if (nextSubmenuLiElem == null) {
        nextSubmenuItem = menuitem.parentNode.parentNode.firstElementChild.querySelector(
          'a',
        );
      } else {
        nextSubmenuItem = nextSubmenuLiElem.querySelector('a');
      }
      nextSubmenuItem.focus();
      this.updateCurrentMenuitem(nextSubmenuItem);
      preventDefault = true;
    } else if (key == this._keyCode.ARROW_UP) {
      /*
        -Moves focus to previous item in the submenu.
        -If focus is on the first item, moves focus to the last item.
      */
      let prevSubmenuItem = undefined;
      let prevSubmenuLiElem = menuitem.parentNode.previousElementSibling;
      if (prevSubmenuLiElem == null) {
        prevSubmenuItem = menuitem.parentNode.parentNode.lastElementChild.querySelector(
          'a',
        );
      } else {
        prevSubmenuItem = prevSubmenuLiElem.querySelector('a');
      }
      prevSubmenuItem.focus();
      this.updateCurrentMenuitem(prevSubmenuItem);
      preventDefault = true;
    } else if (key == this._keyCode.HOME) {
      // Moves focus to the first item in the submenu.
      let firstSubmenuItem = menuitem.parentNode.parentNode.firstElementChild.querySelector(
        'a',
      );
      firstSubmenuItem.focus();
      this.updateCurrentMenuitem(firstSubmenuItem);
      preventDefault = true;
    } else if (key == this._keyCode.END) {
      // Moves focus to the last item in the submenu.
      let lastSubmenuItem = menuitem.parentNode.parentNode.lastElementChild.querySelector(
        'a',
      );
      lastSubmenuItem.focus();
      this.updateCurrentMenuitem(lastSubmenuItem);
      preventDefault = true;
    } else {
      // TODO: Consider adding optional printable character handling.
    }

    if (preventDefault) {
      // The following statements will stop the keys from doing stuff.
      event.stopPropagation();
      event.preventDefault();
    }
  }

  handleMouseoverMenuitem(event) {
    if (event.defaultPrevented) {
      return;
    }

    let menuitem = event.target;

    if (this.hasSubmenu(menuitem)) {
      this.openSubmenu(menuitem);
    }

    this.closeSiblingSubmenus(menuitem);
  }

  handleMouseoutMenubar(event) {
    if (event.defaultPrevented) {
      return;
    }

    let menubar = event.target;

    this.closeAllSubmenus();
  }

  handleClickMenuitem(event) {
    if (event.defaultPrevented) {
      return;
    }

    // Prevent click initially (to make sure click doesn't occur during touch event)
    event.preventDefault();

    let menuitem = event.target;
    this.clickMenuitem(menuitem);

    // TODO: Change behavior for responsive menu...?
  }

  // @see https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Supporting_both_TouchEvent_and_MouseEvent#Event_firing
  // @see https://w3c.github.io/touch-events/#mouse-events
  handleTouchstartMenuitem(event) {
    if (event.defaultPrevented) {
      return;
    }
  }
  handleTouchmoveMenuitem(event) {
    if (event.defaultPrevented) {
      return;
    }

    // User has begun a touch scroll over the menuitem.
    this._touchmoveActive = true;
  }
  handleTouchendMenuitem(event) {
    if (event.defaultPrevented) {
      return;
    }

    event.preventDefault();

    // Don't activate click if user is finishing a touch scroll.
    if (this._touchmoveActive) {
      this._touchmoveActive = false;
    } else {
      let menuitem = event.target;
      this.clickMenuitem(menuitem);
    }
  }

  handleFocusinMenuitem(event) {
    if (event.defaultPrevented) {
      return;
    }

    let menuitem = event.target;
    this.openParentSubmenus(menuitem);
  }

  handleFocusoutNavElem(event) {
    if (event.defaultPrevented) {
      return;
    }

    let newTarget = event.relatedTarget;

    if (newTarget == null || !this._navElem.contains(newTarget)) {
      this.resetNavbar();
    }
  }

  handleTouchendNavElem(event) {
    if (event.defaultPrevented) {
      return;
    }

    // Stop click event in navbar from bubbling above element.
    event.stopPropagation();
  }

  handleTouchendDocument(event) {
    if (event.defaultPrevented) {
      return;
    }

    // Only reset menu when clicking elsewhere in document if responsive menu not active.
    let isResponsiveMenu = this._navElem.classList.contains(
      'a11y-navbar-responsive',
    );
    if (!isResponsiveMenu) {
      // Close submenus, etc. when click occurs anywhere outside of navbar.
      this.resetNavbar();
    }
  }

  handleClickSubmenuToggle(event) {
    if (event.defaultPrevented) {
      return;
    }

    event.preventDefault();

    let button = event.target;
    let menuitem = button.parentNode.querySelector('a[role=menuitem]');
    let ariaExpanded = menuitem.getAttribute('aria-expanded');

    if (ariaExpanded == 'false') {
      this.openSubmenu(menuitem);
    } else if (ariaExpanded == 'true') {
      this.closeSubmenu(menuitem);
    }
  }

  // Utility functions -----------------------------------------------

  menubarResize() {
    let viewportWidth = this._options.windowObj.innerWidth;

    if (viewportWidth <= this._options.breakpointMinWidth) {
      // Show menubar toggle.
      this.addMenubarToggle();

      if (this._options.responsiveSubmenuToggles) {
        this.addSubmenuToggles();
      }
    } else {
      // Hide menubar toggle.
      this.removeMenubarToggle();

      if (this._options.responsiveSubmenuToggles) {
        this.removeSubmenuToggles();
      }
    }
  }

  addMenubarToggle() {
    if (
      this._options.domObj.getElementById(
        this._menubarToggle.getAttribute('id'),
      ) == null
    ) {
      this._navElem.parentNode.insertBefore(this._menubarToggle, this._navElem);
      // Add closed class to menubar.
      this._navElem.classList.add('a11y-navbar-responsive');
      this._navElem.classList.add('a11y-navbar-closed');
      this._menubarToggle.setAttribute('aria-expanded', 'false');
    }
  }

  removeMenubarToggle() {
    if (
      this._options.domObj.getElementById(
        this._menubarToggle.getAttribute('id'),
      )
    ) {
      this._navElem.parentNode.removeChild(this._menubarToggle);
      // Remove open/closed classes from menubar.
      this._navElem.classList.remove('a11y-navbar-responsive');
      this._navElem.classList.remove('a11y-navbar-open');
      this._navElem.classList.remove('a11y-navbar-closed');
      this._menubarToggle.setAttribute('aria-expanded', 'false');
    }
  }

  addSubmenuToggles() {
    let menubar = this._navElem.querySelector('ul');
    let submenuToggles = menubar.querySelectorAll(
      'button.a11y-navbar-submenu-toggle',
    );

    // Only add if they aren't already there.
    if (!submenuToggles.length) {
      let menuitems = menubar.querySelectorAll('a[aria-haspopup=true]');

      for (let i = 0; i < menuitems.length; i++) {
        let submenuToggle = this._options.domObj.createElement('button');
        let submenu = menuitems[i].parentNode.querySelector('ul');
        let submenuId = submenu.getAttribute('id');

        submenuToggle.classList.add('a11y-navbar-submenu-toggle');
        submenuToggle.setAttribute('id', submenuId + '-submenu-toggle');
        submenuToggle.setAttribute('tabindex', '-1');
        submenuToggle.setAttribute('aria-expanded', 'false');
        submenuToggle.setAttribute('aria-controls', submenuId);
        submenuToggle.innerHTML =
          '<span>Open/Close ' + menuitems[i].textContent + ' Submenu</span>';
        submenuToggle.addEventListener(
          'click',
          this.handleClickSubmenuToggle.bind(this),
        );
        let liElem = menuitems[i].parentNode;
        liElem.insertBefore(submenuToggle, menuitems[i]);
      }
    }
  }

  removeSubmenuToggles() {
    let menubar = this._navElem.querySelector('ul');
    let submenuToggles = menubar.querySelectorAll(
      'button.a11y-navbar-submenu-toggle',
    );

    for (let i = 0; i < submenuToggles.length; i++) {
      let liElem = submenuToggles[i].parentNode;
      liElem.removeChild(submenuToggles[i]);
    }
  }

  showMenubar() {
    this._navElem.classList.remove('a11y-navbar-closed');
    this._navElem.classList.add('a11y-navbar-open');
  }

  hideMenubar() {
    this._navElem.classList.remove('a11y-navbar-open');
    this._navElem.classList.add('a11y-navbar-closed');
  }

  toggleInstructions() {
    let instructionsVisible = this._menubarInstructions.classList.contains(
      'a11y-navbar-instructions-show',
    )
      ? true
      : false;

    if (instructionsVisible) {
      this.hideInstructions();
    } else {
      this.showInstructions();
    }
  }

  showInstructions() {
    this._menubarInstructions.classList.add('a11y-navbar-instructions-show');
    this._menubarInstructions.classList.remove('a11y-navbar-instructions-hide');
  }

  hideInstructions() {
    this._menubarInstructions.classList.add('a11y-navbar-instructions-hide');
    this._menubarInstructions.classList.remove('a11y-navbar-instructions-show');
  }

  updateCurrentMenuitem(newMenuitem) {
    this._currentMenuitem.setAttribute('tabindex', '-1');
    this._currentMenuitem = newMenuitem;
    this._currentMenuitem.setAttribute('tabindex', '0');
  }

  hasSubmenu(menuitem) {
    let liElem = menuitem.parentNode;
    let menu = liElem.querySelector('a + ul');
    let response = menu == null ? false : true;

    return response;
  }

  openSubmenu(menuitem) {
    let liElem = menuitem.parentNode;
    let menu = liElem.querySelector('ul');

    // Only open submenu if it exists.
    if (menu != null) {
      menu.classList.remove('a11y-navbar-menu-closed');
      menu.classList.add('a11y-navbar-menu-open');
      menuitem.setAttribute('aria-expanded', 'true');

      // If button exists, update attributes.
      let button = liElem.querySelector('button.a11y-navbar-submenu-toggle');

      if (button != null) {
        button.setAttribute('aria-expanded', 'true');
      }
    }
  }

  openParentSubmenus(menuitem) {
    // Open all submenus above and including the menuitem.
    let submenu = menuitem.parentNode.parentNode;

    if (submenu.classList.contains('a11y-navbar-menu-closed')) {
      let parentMenuitem = submenu.parentNode.querySelector(
        'a[aria-expanded="false"]',
      );

      if (parentMenuitem != null) {
        this.openSubmenu(parentMenuitem);
        this.openParentSubmenus(parentMenuitem);
      }
    }
  }

  closeSubmenus(menuitem) {
    // Close all submenus below and including the menuitem.
    let submenu = menuitem.parentNode.querySelector('ul.a11y-navbar-submenu');

    if (
      submenu != null &&
      submenu.classList.contains('a11y-navbar-menu-open')
    ) {
      let childMenuitems = submenu.querySelectorAll('a[aria-expanded="true"]');

      for (let i = 0; i < childMenuitems.length; i++) {
        this.closeSubmenu(childMenuitems[i]);
      }

      // Close menuitem itself.
      this.closeSubmenu(menuitem);
    }
  }

  closeSubmenu(menuitem) {
    // Close a single submenu.
    let liElem = menuitem.parentNode;
    let menu = liElem.querySelector('ul');

    // Only close submenu if it exists.
    if (menu != null) {
      menu.classList.remove('a11y-navbar-menu-open');
      menu.classList.add('a11y-navbar-menu-closed');
      menuitem.setAttribute('aria-expanded', 'false');

      // If button exists, update attributes.
      let button = liElem.querySelector('button.a11y-navbar-submenu-toggle');

      if (button != null) {
        button.setAttribute('aria-expanded', 'false');
      }
    }
  }

  closeSiblingSubmenus(menuitem) {
    // Close all submenus in current submenu except under current menuitem.
    let siblingMenuitems = this.getSiblingMenuitems(menuitem);

    for (let i = 0; i < siblingMenuitems.length; i++) {
      // Close sibling menuitem and any open child submenus in sibling.
      this.closeSubmenus(siblingMenuitems[i]);
    }
  }

  closeAllSubmenus() {
    // Closes all currently open submenus.
    let openSubmenus = this._navElem.querySelectorAll(
      'ul.a11y-navbar-menu-open',
    );

    for (let i = 0; i < openSubmenus.length; i++) {
      let aElem = openSubmenus[i].parentNode.querySelector('a');
      aElem.setAttribute('aria-expanded', 'false');
      openSubmenus[i].classList.remove('a11y-navbar-menu-open');
      openSubmenus[i].classList.add('a11y-navbar-menu-closed');

      // If buttons exist, update attributes.
      let button = openSubmenus[i].parentNode.querySelector(
        'button.a11y-navbar-submenu-toggle',
      );
      if (button != null) {
        button.setAttribute('aria-expanded', 'false');
      }
    }
  }

  performClick(menuitem) {
    let href = menuitem.getAttribute('href');

    window.location = href;
  }

  clickMenuitem(menuitem) {
    let hasAriaExpanded = menuitem.hasAttribute('aria-expanded');

    if (hasAriaExpanded) {
      let ariaExpanded = menuitem.getAttribute('aria-expanded');

      if (ariaExpanded == 'true') {
        // Only perform click if submenu is already open.
        this.performClick(menuitem);
      } else {
        // If not in responsive menu, close other open submenus.
        let isResponsiveMenu = this._navElem.classList.contains(
          'a11y-navbar-responsive',
        );
        if (!isResponsiveMenu) {
          // Close sibling submenus.
          this.closeSiblingSubmenus(menuitem);
        }

        // Open the submenu.
        this.openSubmenu(menuitem);
      }
    } else {
      // Just perform click (menuitem does not have submenu).
      this.performClick(menuitem);
    }
  }

  resetNavbar() {
    this.updateCurrentMenuitem(this._menubarMenuitems[0]);
    this._currentMenubarIndex = 0;
    this.closeAllSubmenus();
  }

  getSiblingMenuitems(menuitem) {
    // Get immediate siblings of menuitem.
    let menu = menuitem.parentNode.parentNode;
    let liElems = menu.children;
    let siblingMenuitems = [];

    // Siblings are every child of menu that isn't the given menuitem.
    for (let i = 0; i < liElems.length; i++) {
      let childMenuitem = liElems[i].querySelector('a[role=menuitem]');
      if (childMenuitem != menuitem) {
        siblingMenuitems.push(childMenuitem);
      }
    }

    return siblingMenuitems;
  }

  normalizeKey(key) {
    let normalizedKey = null;

    switch (key) {
      case 'Tab':
      case 9:
        normalizedKey = this._keyCode.TAB;
        break;

      case 'Enter':
      case 13:
        normalizedKey = this._keyCode.ENTER;
        break;

      case 'Escape':
      case 'Esc':
      case 13:
        normalizedKey = this._keyCode.ESC;
        break;

      case 'Spacebar':
      case ' ':
      case 32:
        normalizedKey = this._keyCode.SPACE;
        break;

      case 'End':
      case 35:
        normalizedKey = this._keyCode.END;
        break;

      case 'Home':
      case 36:
        normalizedKey = this._keyCode.HOME;
        break;

      case 'Left':
      case 'ArrowLeft':
      case 37:
        normalizedKey = this._keyCode.ARROW_LEFT;
        break;

      case 'Up':
      case 'ArrowUp':
      case 38:
        normalizedKey = this._keyCode.ARROW_UP;
        break;

      case 'Right':
      case 'ArrowRight':
      case 39:
        normalizedKey = this._keyCode.ARROW_RIGHT;
        break;

      case 'Down':
      case 'ArrowDown':
      case 40:
        normalizedKey = this._keyCode.ARROW_DOWN;
        break;
    }

    return normalizedKey;
  }
}
