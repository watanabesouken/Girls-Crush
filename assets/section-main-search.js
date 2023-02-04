const SearchFilters = {
  init: function init(container, sectionId) {
		WAU.Slideout.init("search-filters");

		this.drawerFilters();
		this.currentFilters();

		if ( container.querySelector("[data-filters-price-range]") ) {
			this.priceRange();
			this.priceSlider();
		}
		this.filterData = [];
	},
  priceRange: function priceRange() {
    // Add filter to urlParm after text input changes
    const filters = document.querySelectorAll('.js-filter-range-input');
    if (filters.length > 0) {
      filters.forEach((item, i) => {
        item.addEventListener('change', function(event){
          setTimeout(function() {
            const formData = new FormData(item.closest('form'));
            const searchParams = new URLSearchParams(formData).toString();
            var searchString = window.location.search.toString(),
                searchString = searchString.replace('?', '');
            const finalParams = searchString + '&' + searchParams;

            SearchFilters.renderPage(finalParams, true);

          }, 1000);
        });
      });
    }

    // Open/close horizontal price range filter
    const filterButtons = document.querySelectorAll('.js-hz-filter-price-trigger');

    filterButtons.forEach((item, i) => {
      // Show or hide dropdown when clicking
      document.addEventListener('click', function(event){
        const dropdown = item.nextElementSibling;
        const isTrigger = event.target.classList.contains('js-hz-filter-price-trigger');
        const isDropdown = dropdown.contains(event.target);

        // Prevent default on button
        if (isTrigger) {
          event.preventDefault();
        }

        // Hide dropdown on off click
        if (!isDropdown && !isTrigger) {
          item.classList.remove('active');
          dropdown.style.display = 'none';
        }

        // Only show dropdown if clicked Trigger
        if (!isTrigger) return false;

        if (dropdown.style.display == 'inline-block') {
          item.classList.remove('active');
          dropdown.style.display = 'none';
        } else {
          item.classList.add('active');
          dropdown.style.display = 'inline-block';
        }

      });

      // Show dropdown when tabbing on
      let mouseDown = false;

      item.addEventListener('mousedown', () => {
        mouseDown = true;
      });

      item.addEventListener('mouseup', () => {
        mouseDown = false;
      });

      item.addEventListener('focus', (event) => {
        if (!mouseDown) {
          const dropdown = event.target.nextElementSibling;
          item.classList.add('active');
          dropdown.style.display = 'inline-block';
        }
      });

      // Hide dropdown when tabbing off
      document.addEventListener('keyup', (event) => {
        if (event.keyCode == 9) {
          const dropdown = document.querySelector('.js-hz-filter-price-dropdown');

          if (!document.querySelector('.js-hz-filter-price').contains(event.target)) {
            item.classList.remove('active');
            dropdown.style.display = 'none';
          }
        }
      });
    });
  },
  priceSlider: function priceSlider() {
    var parents = document.querySelectorAll(".js-price-range");

    if ( !parents ) return false;

    parents.forEach((parent, i) => {
      var rangeS = parent.querySelectorAll("input[type=range]"),
          numberS = parent.querySelectorAll("input[type=number]");

      rangeS.forEach(function(el) {
        el.oninput = function() {
          var slide1 = parseFloat(rangeS[0].value),
              slide2 = parseFloat(rangeS[1].value);

          var slide1Dec = (Math.round(slide1 * 100) / 100),
							slide2Dec = (Math.round(slide2 * 100) / 100);

          if (parseFloat(slide1Dec) > parseFloat(slide2Dec)) { [slide1Dec, slide2Dec] = [slide2Dec, slide1Dec] }

          numberS[0].value = slide1Dec;
          numberS[1].value = slide2Dec;
        }
      });

      rangeS[0].onchange = function() {
        numberS[0].dispatchEvent(new Event('change', { bubbles: true }));
      }
      rangeS[1].onchange = function() {
        numberS[1].dispatchEvent(new Event('change', { bubbles: true }));
      }

      numberS.forEach(function(el) {
        el.oninput = function() {
          var number1 = parseFloat(numberS[0].value),
              number2 = parseFloat(numberS[1].value);

          var number1Dec = (Math.round(number1 * 100) / 100),
              number2Dec = (Math.round(number2 * 100) / 100);

          if (number1Dec > number2Dec) {
            var tmp = number1Dec;
            numberS[0].value = number2Dec;
            numberS[1].value = tmp;
          }

          rangeS[0].value = number1Dec;
          rangeS[1].value = number2Dec;

        }
      });
    });
  },
  currentFilters: function currentFilters() {
    const filters = document.querySelectorAll('.js-current-filter');

    filters.forEach((item, i) => {
      item.addEventListener('click', (event) => {
        event.preventDefault();
        SearchFilters.onActiveFilterClick(event);
      });
    });
  },
  drawerFilters: function drawerFilters() {
    const filters = document.querySelectorAll('.js-filter');

    filters.forEach((item, i) => {

      item.addEventListener('click', (event) => {
        event.preventDefault();

        if ( item.querySelector('input[type="checkbox"]').checked ) {
          item.classList.remove('current');
          item.querySelector('input[type="checkbox"]').checked = false;
        } else {
          item.classList.add('current');
          item.querySelector('input[type="checkbox"]').checked = true;
        }

        const formData = new FormData(item.closest('form'));
        const searchParams = new URLSearchParams(formData).toString();
        var searchString = window.location.search.toString(),
            searchString = searchString.replace('?', '');
        const finalParams = searchString + '&' + searchParams;

        SearchFilters.renderPage(finalParams);
      });
    });
  },
  renderFilters: function renderFilters() {
    var container = document.querySelector('[data-section-type="search-template"]');
    WAU.Slideout.init("search-filters");
    WAU.Slideout._openByName("search-filters");

    this.drawerFilters();
    this.currentFilters();

    // Reinit Filter Slideout Toggle
    container.querySelectorAll('.js-menu-toggle').forEach((item, i) => {
      setTimeout(function() {
        MultipleMenus.init(container, item);
      }, 90);
    });

    // Reinit Filter Slideout Menus
    container.querySelectorAll('.js-mobile-menu').forEach((item, i) => {
      setTimeout(function() {
        SlidingNav.init(container, item);
      }, 90);
    });

    if ( container.querySelector("[data-filters-price-range]") ) {
      this.priceRange();
      this.priceSlider();
    }

    WAU.Quickshop.init();
    WAU.ProductGridVideo.init();
    WAU.Helpers.lazyLoad('.lazy', true);
  },
  renderSectionFromFetch: function renderSectionFromFetch(url, section) {
    fetch(url)
      .then(response => response.text())
      .then((responseText) => {
        const html = responseText;
        this.filterData = [...this.filterData, { html, url }];
        this.renderSearchGrid(html);
        this.renderFilters();
      });
  },
  renderSectionFromCache: function renderSectionFromCache(filterDataUrl, section) {
    const html = this.filterData.find(filterDataUrl).html;
    this.renderSearchGrid(html);
    this.renderFilters();
  },
  renderPage: function renderPage(searchParams, updateURLHash = true) {
    const sections = this.getSections();

    sections.forEach((section) => {
      const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
      const filterDataUrl = element => element.url === url;

      this.filterData.some(filterDataUrl) ?
        this.renderSectionFromCache(filterDataUrl, section) :
        this.renderSectionFromFetch(url, section);
    });

    if (updateURLHash) this.updateURLHash(searchParams);
  },
  renderSearchGrid: function renderSearchGrid(html) {
    const innerHTML = new DOMParser()
      .parseFromString(html, 'text/html')
      .getElementById('searchResultsWrapper').innerHTML;

    document.getElementById('searchResultsWrapper').innerHTML = innerHTML;
  },
  onActiveFilterClick: function onActiveFilterClick(event) {
    event.preventDefault();
    const searchParams = new URL(event.currentTarget.href).searchParams.toString();
    const searchString = new URL(window.location).searchParams.get('q');

    var finalSearchParams = ( searchParams.includes('q=') ) ? searchParams : 'q=' + searchString;

    SearchFilters.renderPage(finalSearchParams);
  },
  updateURLHash: function updateURLHash(searchParams) {
    history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
  },
  getSections: function getSections() {
    return [
      {
        id: 'main-search-results',
        section: document.getElementById('main-search-results').dataset.id,
      }
    ]
  }
}

document.querySelectorAll('[data-section-type="search-template"]').forEach(function(container){
  // Filters Drawer
  if ( container.querySelector("[data-search-filters]") ) {
    SearchFilters.init(container, container.dataset.sectionId);
  }

  // Filter Slideout Toggle
  container.querySelectorAll('.js-menu-toggle').forEach((item, i) => {
    Events.on('slideout:open:search-filters', function() {
      setTimeout(function() {
        MultipleMenus.init(container, item);
      }, 90);
    });
  });

  // Filter Slideout Menus
  container.querySelectorAll('.js-mobile-menu').forEach((item, i) => {
    Events.on('slideout:open:search-filters', function() {
      setTimeout(function() {
        SlidingNav.init(container, item);
      }, 90);
    });
  });
});

document.addEventListener("shopify:section:load", function(event) {
  if (event.target.querySelector('[data-section-type="search-template"]')) {
		var container = event.target.querySelector('[data-section-type="search-template"]');

    // Filters Drawer
		if ( container.querySelector("[data-search-filters]") ) {
	    SearchFilters.init(container, container.dataset.sectionId);
	  }

		    // Filter Slideout Toggle
    container.querySelectorAll('.js-menu-toggle').forEach((item, i) => {
      Events.on('slideout:open:search-filters', function() {
        setTimeout(function() {
          MultipleMenus.init(container, item);
        }, 90);
      });
    });

    // Filter Slideout Menus
    container.querySelectorAll('.js-mobile-menu').forEach((item, i) => {
      Events.on('slideout:open:search-filters', function() {
        setTimeout(function() {
          SlidingNav.init(container, item);
        }, 90);
      });
    });

  }
});
