document.querySelectorAll('[data-section-type="carousel"]').forEach(function(container){
  const loader = new WAU.Helpers.scriptLoader();
  loader.load([jsAssets.flickity]).finally(() => {
    setTimeout(function() {
      carouselInit(container);
    }, 200);
  });
});

document.addEventListener("shopify:section:load", function(event) {
  if ( !event.target.querySelector('[data-section-type="carousel"]') ) return false;
  setTimeout(function() {
    carouselInit(event.target);
  }, 200);
});

document.addEventListener("shopify:block:select", function(event) {
  if ( !event.target.querySelector('[data-section-type="carousel"]') ) return false;
  carouselSlideEdit(event.target);
});

document.addEventListener("shopify:block:deselect", function(event) {
  if ( !event.target.querySelector('[data-section-type="carousel"]') ) return false;
  carouselSlideRestart(event.target);
});

function carouselInit(container) {
  var carousel = container.querySelector('.js-carousel');

  if ( !carousel ) return false;

  if ( carousel.classList.contains('carousel-loaded--false') ) {
    carousel.classList.remove('carousel-loaded--false');
    carousel.classList.add('carousel-loaded--true');
  }

  const flktyData = carousel.getAttribute('data-flickity');
  const flktyOptions = JSON.parse(flktyData);
  new Flickity(carousel, flktyOptions);
  carouselResize(carousel);

  // Carousel pagination
  var carouselPag = container.querySelector('.js-carousel-pagination');
  if ( !carouselPag ) return false;
  carouselPagination(carousel, carouselPag);

}

function carouselSlideEdit(container) {
  var carousel = container.closest('.js-carousel');

  if ( !carousel ) return false;

  var flkty = Flickity.data(carousel);
  var slide = container.getAttribute("data-slider-index");
  flkty.select(slide);
  flkty.pausePlayer();
}

function carouselSlideRestart(container) {
  var carousel = container.closest('.js-carousel');

  if ( !carousel ) return false;

  const flkty = Flickity.data(carousel);
  flkty.unpausePlayer();
}

function carouselResize(carousel) {
  var flkty = Flickity.data(carousel);
  flkty.resize();
}

function carouselPagination(carousel, pagination) {
  var flkty = Flickity.data(carousel);

  flkty.on( 'select', function() {
    var slideNumber = flkty.selectedIndex + 1;
    pagination.textContent = '(' + slideNumber + ' of ' + flkty.slides.length + ')';
  });
}
