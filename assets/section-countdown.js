function getCountDown(container){
  // Fade countdown in
  setTimeout(function() {
    container.querySelectorAll('.collection-countdown__time--wrapper').forEach((item, i) => {
      item.style.opacity = 1;
    });
  }, 100);

  var timestamp = container.getAttribute('data-launch-date'),
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

    if ( days > 0 ) container.querySelector('[data-launch-days]').innerHTML = days;
    if ( hours > 0 ) container.querySelector('[data-launch-hours]').innerHTML = hours;
    if ( mins > 0 ) container.querySelector('[data-launch-mins]').innerHTML = mins;
    if ( secs > 0 ) container.querySelector('[data-launch-secs]').innerHTML = secs;

    if (t < 0) {
      clearInterval(count);
      reloadSection(container);
    }

  },1000);
}

function toggleForm(container) {
  container.querySelector('.js-notify-form-trigger').addEventListener('click', function() {
    event.preventDefault();
    WAU.Helpers.fadeToggle(container.querySelector('.js-notify-form-wrap'), 'grid');
  });
}

function reloadSection(container) {
  const id = container.dataset.sectionId;
  const url = `${container.dataset.baseUrl}?section_id=${ id }`;

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

    container.querySelector('#countdownTitle').innerHTML = doc.querySelector('#countdownTitle').innerHTML;
    container.querySelector('#countdownWrapper').innerHTML = doc.querySelector('#countdownWrapper').innerHTML;
  });
}


document.querySelectorAll('[data-section-type="countdown"]').forEach(function(container, i){
  getCountDown(container);

  if (container.querySelector('.js-notify-form-trigger')) {
    toggleForm(container)
  }
});
document.addEventListener("shopify:section:select", function(event) {
  if (!event.target.querySelector('[data-section-type="countdown"]')) return false;
  var container = event.target.querySelector('[data-section-type="countdown"]');

  getCountDown(container);
  if (container.querySelector('.js-notify-form-trigger')) {
    toggleForm(container)
  }
});
