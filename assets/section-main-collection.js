const CollectionFilters = {
	init: function init(container, sectionId) {
		WAU.Slideout.init("collection-filters");

		this.drawerFilters();
		this.currentFilters();
		this.updateCollectionMsg(container);

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

						CollectionFilters.renderPage(searchParams, true);

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
				CollectionFilters.onActiveFilterClick(event);
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

				CollectionFilters.renderPage(searchParams);
			});
		});
	},
	renderFilters: function renderFilters() {
		var container = document.querySelector('[data-section-type="collection"]');
		WAU.Slideout.init("collection-filters");
		WAU.Slideout._openByName("collection-filters");

		this.drawerFilters();
		this.currentFilters();
		this.updateCollectionMsg(container);

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
				this.renderProductGrid(html);
				this.renderFilters();
			});
	},
	renderSectionFromCache: function renderSectionFromCache(filterDataUrl, section) {
		const html = this.filterData.find(filterDataUrl).html;
		this.renderProductGrid(html);
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
	renderProductGrid: function renderProductGrid(html) {
		const innerHTML = new DOMParser()
      .parseFromString(html, 'text/html')
      .getElementById('CollectionProductGrid').innerHTML;

    document.getElementById('CollectionProductGrid').innerHTML = innerHTML;

	},
	updateCollectionMsg: function updateCollectionMsg(container) {
		var empty = container.getAttribute('data-empty'),
				filterMsg = container.querySelector('.js-coll-empty-filter'),
				regMsg = container.querySelector('.js-coll-empty');

		if ( !filterMsg || !regMsg ) return false;

		if ( empty === 'true' ) {
			filterMsg.style.display = 'none';
			regMsg.style.display = 'block';
		} else {
			filterMsg.style.display = 'block';
			regMsg.style.display = 'none';
		}
	},
	onActiveFilterClick: function onActiveFilterClick(event) {
		event.preventDefault();
		this.renderPage(new URL(event.currentTarget.href).searchParams.toString());
	},
	updateURLHash: function updateURLHash(searchParams) {
		history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
	},
	getSections: function getSections() {
    return [
      {
        id: 'main-collection-product-grid',
        section: document.getElementById('main-collection-product-grid').dataset.id,
      }
    ]
  }
}

CollectionCountdown = function (context) {
  // Fade countdown in
  setTimeout(function() {
    context.querySelectorAll('.collection-countdown__time--wrapper').forEach((item, i) => {
      item.style.opacity = 1;
    });
  }, 90);

  var timestamp = context.getAttribute('data-launch-date'),
      timestamp = parseInt(timestamp);

  if ( !timestamp ) return false;

  var count = setInterval(function(){
      var nowTime = new Date();
      var endTime = new Date(timestamp * 1000);

      var t = endTime.getTime() - nowTime.getTime();
      var days = Math.floor(t/1000/60/60/24);
      var hours = Math.floor(t/1000/60/60%24);
      var mins = Math.floor(t/1000/60%60);
      var secs = Math.floor(t/1000%60);

      if (days < 10) {
        days = "0" + days;
      }
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (mins < 10) {
        mins = "0" + mins;
      }
      if (secs < 10) {
        secs = "0" + secs;
      }

    if ( days > 0 ) context.querySelector('[data-launch-days]').innerHTML = days;
    if ( hours > 0 ) context.querySelector('[data-launch-hours]').innerHTML = hours;
    if ( mins > 0 ) context.querySelector('[data-launch-mins]').innerHTML = mins;
    if ( secs > 0 ) context.querySelector('[data-launch-secs]').innerHTML = secs;

    if (t < 0) {
      clearInterval(count);
      reloadSection(context);
    }

  },1000);
}

function reloadSection(container) {
  const url = container.dataset.url;

  fetch(url)
  .then(function(response) {
    return response.text();
  })
  .then(function(html) {
    if (html.trim() === '') {
      return;
    }
    // Convert the HTML string into a document object
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');

    document.querySelector('.page-wrap').innerHTML = doc.querySelector('.page-wrap').innerHTML;

    document.querySelectorAll('[data-section-loaded="false"]').forEach(section => section.setAttribute("data-section-loaded", true));
  });
}


document.querySelectorAll('[data-section-type="collection"]').forEach(function(container){
	// Filters Drawer
  if ( container.querySelector("[data-collection-filters]") ) {
    CollectionFilters.init(container, container.dataset.sectionId);
  }

	// Filter Slideout Toggle
	container.querySelectorAll('.js-menu-toggle').forEach((item, i) => {
		Events.on('slideout:open:collection-filters', function() {
      setTimeout(function() {
        MultipleMenus.init(container, item);
      }, 90);
    });
	});

	// Filter Slideout Menus
	container.querySelectorAll('.js-mobile-menu').forEach((item, i) => {
		Events.on('slideout:open:collection-filters', function() {
      setTimeout(function() {
        SlidingNav.init(container, item);
      }, 90);
    });
	});

	// Timeline Countdown Button
	if ( container.querySelectorAll('[data-product-countdown]').length > 0 ) {
		container.querySelectorAll('[data-product-countdown]').forEach((item, i) => {
			CollectionCountdown(item);
		});
	}

	// Timeline Cta Button
	if (container.querySelectorAll('.js-notify-form-trigger').length > 0) {
    container.querySelectorAll('.js-notify-form-trigger').forEach((item, i) => {
			item.addEventListener('click', function() {
	      event.preventDefault();
	      var context = item.nextElementSibling;
	      WAU.Helpers.fadeToggle(context.querySelector('.js-notify-form-wrap'), 'grid');
	    });
    });
  }
});

document.querySelectorAll('[data-section-type="template-header"]').forEach(function(container){
	if ( container.querySelector('[data-product-countdown]') ) {
		CollectionCountdown(container);
	}
});

document.querySelectorAll('.template-header[data-section-type="parallax"]').forEach(function(container){
	if ( container.querySelector('[data-product-countdown]') ) {
		CollectionCountdown(container);
	}
});

document.addEventListener("shopify:section:load", function(event) {
  if (event.target.querySelector('[data-section-type="collection"]')) {
		var container = event.target.querySelector('[data-section-type="collection"]');

		// Filters Drawer
		if ( container.querySelector("[data-collection-filters]") ) {
	    CollectionFilters.init(container, container.dataset.sectionId);
	  }

		// Filter Slideout Toggle
		container.querySelectorAll('.js-menu-toggle').forEach((item, i) => {
			Events.on('slideout:open:collection-filters', function() {
	      setTimeout(function() {
	        MultipleMenus.init(container, item);
	      }, 90);
	    });
		});

		// Filter Slideout Menus
		container.querySelectorAll('.js-mobile-menu').forEach((item, i) => {
			Events.on('slideout:open:collection-filters', function() {
	      setTimeout(function() {
	        SlidingNav.init(container, item);
	      }, 90);
	    });
		});

		// Timeline Countdown Button
		if ( container.querySelectorAll('[data-product-countdown]').length > 0 ) {
			container.querySelectorAll('[data-product-countdown]').forEach((item, i) => {
				CollectionCountdown(item);
			});
		}

		// Timeline Cta Button
		if (container.querySelectorAll('.js-notify-form-trigger').length > 0) {
	    container.querySelectorAll('.js-notify-form-trigger').forEach((item, i) => {
				item.addEventListener('click', function() {
		      event.preventDefault();
		      var context = item.nextElementSibling;
	      	WAU.Helpers.fadeToggle(context.querySelector('.js-notify-form-wrap'), 'grid');
		    });
	    });
	  }
  }

	if (event.target.querySelector('[data-section-type="template-header"]')) {
		var container = event.target.querySelector('[data-section-type="template-header"]');
		if ( container.querySelector('[data-product-countdown]') ) {
			CollectionCountdown(container);
		}
	}
	if (event.target.querySelector('.template-header[data-section-type="parallax"]')) {
		var container = event.target.querySelector('.template-header[data-section-type="parallax"]');
		if ( container.querySelector('[data-product-countdown]') ) {
			CollectionCountdown(container);
		}
	}
});
