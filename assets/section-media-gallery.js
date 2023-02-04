EnlargePhoto = {
  init(container) {
    let buttons = container.querySelectorAll('.js-zoom-btn');

    buttons.forEach((button, i) => {
      button.addEventListener('click', function (event) {
        event.preventDefault();

        var btn = event.target,
            index = btn.getAttribute('data-index'),
            index = parseInt(index,10);

        const loader = new WAU.Helpers.scriptLoader();
        loader.load([jsAssets.zoom]).then(() => {
          EnlargePhoto.openPhotoSwipe(container, btn, index);
        });

      });
    });
  },
  openPhotoSwipe(container, btn, index) {
    var pswpElement = document.querySelectorAll('.pswp')[0];
    var images = container.querySelectorAll('img');

    let items = [];
    images.forEach((image, i) => {
      let item = {
        src: image.getAttribute('zoom-src'),
        w: image.getAttribute('width'),
        h: image.getAttribute('height')
      }
      items.push(item);
    });

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

VideoControls = {
  init(container) {
    var buttons = container.querySelectorAll('.js-play-video');

    buttons.forEach((button, i) => {
      button.addEventListener('click', function(event) {
        var videoId = button.getAttribute('data-video-trigger'),
          video = container.querySelector(`#${videoId}`),
          videoType = button.getAttribute('data-video-type');

        if ( videoType === 'html' ) {
          event.target.style.display = 'none';
          video.play();

          video.addEventListener('click', function() {
            event.target.style.display = 'block';
            video.pause();
          });
        } else {

          if ( !video ) return false;
          button.style.display = 'none';
          if ( button.parentNode.querySelector('img') ) {
            button.parentNode.querySelector('img').style.display = 'none';
          } else if ( button.parentNode.querySelector('.placeholder-svg') ) {
            button.parentNode.querySelector('.placeholder-svg').style.display = 'none';
          }
        }

      });
    });
  }
}
document.querySelectorAll('[data-section-type="media-gallery"]').forEach(function(container){
  if ( container.querySelectorAll('.js-zoom-btn').length > 0 ) {
    EnlargePhoto.init(container);
  }

  if ( container.querySelectorAll('.js-play-video').length > 0 ) {
    VideoControls.init(container);
  }
});

document.addEventListener("shopify:section:select", function(event) {
  if ( !event.target.querySelector('[data-section-type="media-gallery"]') ) return false;
  var container = event.target.querySelector('[data-section-type="media-gallery"]');
  EnlargePhoto.init(container);
  VideoControls.init(container);
});
