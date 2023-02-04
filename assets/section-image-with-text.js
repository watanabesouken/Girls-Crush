EnlargePhoto = {
  init(container) {
    let button = container.querySelector('.js-zoom-btn');

    button.addEventListener('click', function (event) {
      event.preventDefault();

      var btn = event.target,
          index = btn.getAttribute('data-index'),
          index = parseInt(index,10);

      const loader = new WAU.Helpers.scriptLoader();
      loader.load([jsAssets.zoom]).then(() => {
        EnlargePhoto.openPhotoSwipe(btn, index);
      });

    });
  },
  openPhotoSwipe(btn, index) {
    var pswpElement = document.querySelectorAll('.pswp')[0];

    var items = [
      {
        src: btn.getAttribute('href'),
        w: btn.getAttribute('data-width'),
        h: btn.getAttribute('data-height')
      }
    ];

    var options = {
      index: index,
      captionEl: false,
      closeOnScroll: false,
      counterEl: false,
      history: false,
      fullscreenEl: false,
      preloaderEl: false,
      shareEl: false,
      tapToClose: false,
      zoomEl: true
    };

    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
  }
}

document.querySelectorAll('[data-section-type="image-with-text"]').forEach(function(container){
  if ( !container.querySelector('.js-zoom-btn') ) return false;
  EnlargePhoto.init(container);
});

document.addEventListener("shopify:section:select", function(event) {
  if ( !event.target.querySelector('[data-section-type="image-with-text"]') ) return false;
  var container = event.target.querySelector('[data-section-type="image-with-text"]');
  EnlargePhoto.init(container);
});
