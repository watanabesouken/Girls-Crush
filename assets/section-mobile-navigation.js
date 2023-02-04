SlidingNav = {
  init(section, container) {
    // Update wrapper height and first class on load
    SlidingNav.updateWrapper(section, container);

    SlidingNav.updateTabIndex(container);

    container.querySelectorAll('[data-link-trigger]').forEach((item, i) => {
      // On button click
      item.addEventListener("click", function(event){
        event.preventDefault();
        SlidingNav.removeClasses(container);
        SlidingNav.addClass(event, container);
        SlidingNav.updateWrapper(section, container);
      });

      // On tab to key enter
      item.addEventListener("keydown", function(event){
        if (event.which === 13) {
          event.preventDefault();
          SlidingNav.removeClasses(container);
          SlidingNav.addClass(event, container);
          SlidingNav.updateWrapper(section, container);
        }
      });
    });
  },
  updateTabIndex(container) {
    var navs = container.querySelectorAll('[data-link-parent]');

    navs.forEach((nav, i) => {
      if ( nav.classList.contains('nav-slide--active') ) {
        nav.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])').forEach((item, i) => {
          item.removeAttribute('tabindex');
        });
      } else {
        nav.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])').forEach((item, i) => {
          item.setAttribute('tabindex', '-1');
        });
      }
    });
  },
  removeClasses(container) {
    container.querySelectorAll('.nav-slide--active').forEach((item, i) => {
      item.classList.remove('nav-slide--active');
    });

    // var activeMenu = document.querySelector('.active--menu.js-mobile-menu');

    // activeMenu.querySelectorAll('a, button').forEach((item, i) => {
    //   item.setAttribute('tabindex', '-1');
    // });

    // Update tab index
    SlidingNav.updateTabIndex(container);
  },
  addClass(event, container){
    var getMenu = event.target.getAttribute('data-link-trigger'),
        parent = container.querySelector(`[data-link-parent="${getMenu}"]`);

    parent.classList.add('nav-slide--active');

    // Update tab index
    SlidingNav.updateTabIndex(container);
  },
  updateWrapper(section, container) {
    var wrapper = section.querySelector('.js-menu-outer'),
        activeMenu = document.querySelector('.js-mobile-menu.active--menu'),
        activeSlide = section.querySelector('.nav-slide--active');
        height = activeSlide.offsetHeight;

    wrapper.style.height = `${height}px`;
  }
}

MultipleMenus = {
  init(container, item) {
    // Update wrapper height and first class on load
    MultipleMenus.updateWrapper(container);

    // On button click
    item.addEventListener("click", function(event) {
      event.preventDefault();

      MultipleMenus.removeClasses(container);

      if ( event.target.classList.contains('js-slideout-open') ) {
        var togMenu = event.target.dataset.toggleMenu;
        var drawerBtn = container.querySelector(`[data-toggle-menu="${ togMenu }"].menu-toggle`)
        MultipleMenus.addClass(drawerBtn, container);
      } else {
        MultipleMenus.addClass(event.target, container);
      }

      MultipleMenus.updateWrapper(container);
    });

    // On tab to key enter
    item.addEventListener("keydown", function(event) {
      if (event.which === 13) {
        event.preventDefault();

        MultipleMenus.removeClasses(container);
        MultipleMenus.addClass(event.target, container);
        MultipleMenus.updateWrapper(container);
      }
    });
  },
  removeClasses(container) {
    container.querySelectorAll('.active--menu').forEach((item, i) => {
      item.classList.remove('active--menu');
    });
    container.querySelectorAll('.nav-slide--active').forEach((item, i) => {
      item.classList.remove('nav-slide--active');
    });
  },
  addClass(btn, container) {
    var menuHandle = btn.getAttribute('data-toggle-menu'),
        menu = container.querySelector(`[data-menu-handle="${menuHandle}"]`),
        firstSlide = menu.querySelector('.slide-nav__first-level--wrapper');

    btn.classList.add('active--menu');
    menu.classList.add('active--menu');
    firstSlide.classList.add('nav-slide--active');
  },
  updateWrapper(container) {
    var wrapper = container.querySelector('.js-menu-outer'),
        activeSlide = wrapper.querySelector('.active--menu'),
        height = activeSlide.offsetHeight;

    wrapper.style.height = `${height}px`;
  }
}

document.querySelectorAll('[data-section-type="mobile-navigation"]').forEach(function(container){

  container.querySelectorAll('.js-menu-toggle').forEach((item, i) => {
    Events.on('slideout:open:mobile-navigation', function() {
      setTimeout(function() {
        MultipleMenus.init(container, item);
      }, 90);
    });
  });

  container.querySelectorAll('.js-mobile-menu').forEach((item, i) => {
    Events.on('slideout:open:mobile-navigation', function() {
      setTimeout(function() {
        SlidingNav.init(container, item);
      }, 90);
    });
  });

  if ( document.querySelector('.mobile-nav__mobile-header .js-mini-cart-trigger') ) {
    document.querySelector('.mobile-nav__mobile-header .js-mini-cart-trigger').addEventListener("click", function() {
      WAU.Slideout._closeByName("mobile-navigation");
    });
  }
});

document.addEventListener("shopify:section:select", function(event) {
  if ( !event.target.querySelector('[data-section-type="mobile-navigation"]') ) return false;
  var container = event.target.querySelector('[data-section-type="mobile-navigation"]');

  setTimeout(() => {
    container.querySelectorAll('.js-menu-toggle').forEach((item, i) => {
      MultipleMenus.init(container, item);
    });

    container.querySelectorAll('.js-mobile-menu').forEach((item, i) => {
      SlidingNav.init(container, item);
    });

    WAU.Slideout._openByName("mobile-navigation");
  }, 200);
});

document.addEventListener("shopify:section:load", function(event) {
  if ( !event.target.querySelector('[data-section-type="mobile-navigation"]') ) return false;
  var container = event.target.querySelector('[data-section-type="mobile-navigation"]');

  setTimeout(() => {
    container.querySelectorAll('.js-menu-toggle').forEach((item, i) => {
      MultipleMenus.init(container, item);
    });

    container.querySelectorAll('.js-mobile-menu').forEach((item, i) => {
      SlidingNav.init(container, item);
    });

    WAU.Slideout._openByName("mobile-navigation");
  }, 200);
});
