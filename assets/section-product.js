document.querySelectorAll('[data-section-type="product"].product-page').forEach(function(container){
  const loader = new WAU.Helpers.scriptLoader();
  loader.load([jsAssets.flickity]).finally(() => {
    loader.load([jsAssets.panes]).finally(() => {

      if ( container.dataset.productVideo === 'true' ) {
        loader.load([jsAssets.productVideo]).finally(() => {});
      }
      if ( container.dataset.productModel === 'true' ) {
        loader.load([jsAssets.productModel]).finally(() => {});
      }
      loader.load([jsAssets.product]).finally(() => {});
    });
  });
});
