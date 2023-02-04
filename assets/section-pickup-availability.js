document.querySelectorAll('[data-section-type="pickup-availability"]').forEach(function(container){
  var id = container.dataset.variantId,
      title = container.dataset.productTitle;

  loadAvailability(id, title);
}.bind(this));

Events.on("storeavailability:variant", function(id, title) {
  loadAvailability(id, title)
});

Events.on("storeavailability:unavailable", function() {
  document.querySelector('[data-store-availability-container]').style.display = "none";
});

document.addEventListener("shopify:block:select", function(event) {
  if (event.target.hasAttribute('data-section-type', 'pickup-availability')) {
    var container = event.target,
        id = container.dataset.variantId,
        title = container.dataset.productTitle;
    loadAvailability(id, title);
  }
});

function loadAvailability(id, title) {
  const container = document.querySelector('[data-store-availability-container]');
  const variantSectionUrl =
  container.dataset.baseUrl + '/variants/' + id + '/?section_id=pickup-availability';
  container.innerHTML = '';

  fetch(variantSectionUrl)
  .then(function(response) {
    return response.text();
  })
  .then(function(storeAvailabilityHTML) {
    if (storeAvailabilityHTML.trim() === '') {
      return;
    }

    container.innerHTML = storeAvailabilityHTML;
    container.innerHTML = container.firstElementChild.innerHTML;
    container.style.opacity = 1;

    // Show or hide container if variant unavailable
    container.style.visibility = "visible";

    // If no active pickup locations hide container and stop function
    if ( document.querySelector('[data-pick-up-available="false"]') ) {
      container.style.visibility = "hidden";
      return false;
    } else {
      container.style.visibility = "visible";
    }


    // Move modal code to slideout
    const source = document.getElementById("StoreAvailabilityModal");

    // create the slideout el, assign it a name, and then add
    const slideoutContainer = document.querySelector(".js-slideout-toggle-wrapper");
    const slideoutAside = document.getElementById('slideout-store-availability');

    if ( slideoutAside ) {
      slideoutAside.innerHTML = "";
      slideoutAside.appendChild(source);
    } else {
      const newSlideout = WAU.Slideout._createSlideoutEl("right", "store-availability", slideoutContainer);
      newSlideout.appendChild(source);
    }

    WAU.Slideout.init("store-availability");

    // Update product title
    const storeAvailabilityModalProductTitle = document.querySelector('[data-store-availability-modal-product-title]');
    storeAvailabilityModalProductTitle.textContent = title;

  });
}
