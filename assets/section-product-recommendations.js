document.querySelectorAll('[data-section-type="product-recommendations"]').forEach(function(container){
  loadRecommendations(container);
}.bind(this));

document.addEventListener("shopify:section:select", function(event) {
  if ( !event.target.querySelector('[data-section-type="product-recommendations"]') ) return false;
  loadRecommendations(event.target.querySelector(".js-product-rec-wrapper"));
});

function loadRecommendations(container) {
  var baseUrl = container.dataset.baseUrl,
      productId = container.dataset.productId,
      sectionId = container.dataset.sectionId;

  var recommendationsSectionUrl = baseUrl + '?section_id='+ sectionId + '&product_id=' + productId;

  fetch(recommendationsSectionUrl)
  .then(function(response) {
    return response.text();
  })
  .then(function(productHtml) {
    if (productHtml.trim() === '') return;

    container.innerHTML = productHtml;
    container.innerHTML = container.firstElementChild.innerHTML;

    WAU.Quickshop.init();
    WAU.ProductGridVideo.init();
    WAU.Helpers.lazyLoad('.lazy', true);
  });
}
