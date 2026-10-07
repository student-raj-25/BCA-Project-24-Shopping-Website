(function () {
  const products = window.NORTHSTAR_CATALOG;

  const formatPrice = value => `₹${Number(value).toLocaleString("en-IN")}`;

  function productCard(product) {
    const discount = Math.round((1 - product.price / product.oldPrice) * 100);
    const wished = window.ShopCart && window.ShopCart.isWishlisted(product.id);
    const tagClass = product.tag === "Deal" ? "product-tag deal" : "product-tag";
    return `<article class="product-card reveal"><div class="product-media"><a href="product-details.html?id=${encodeURIComponent(product.id)}" aria-label="View ${product.title}"><img loading="lazy" src="${product.image}" alt="${product.title}"></a><span class="${tagClass}">${product.tag}</span><button class="product-icon-btn ${wished ? "is-active" : ""}" data-toggle-wishlist="${product.id}" aria-label="${wished ? "Remove from" : "Add to"} wishlist"><i class="bi bi-heart${wished ? "-fill" : ""}"></i></button><button class="quick-view-btn" data-quick-view="${product.id}">Quick view</button></div><div class="product-info"><div class="product-category">${product.category}</div><h3 class="product-title"><a href="product-details.html?id=${encodeURIComponent(product.id)}">${product.title}</a></h3><div class="product-rating" aria-label="Rated ${product.rating} out of 5"><i class="bi bi-star-fill"></i> ${product.rating} <span>(${product.reviews.toLocaleString("en-IN")})</span></div><div class="product-price-row"><span class="product-price">${formatPrice(product.price)}</span><span class="product-old-price">${formatPrice(product.oldPrice)}</span><span class="product-discount">${discount}% off</span></div><button class="product-add ripple" data-add-to-cart="${product.id}"><i class="bi bi-bag-plus me-1"></i> Add to basket</button></div></article>`;
  }

  function renderCards(items, target, emptyMessage = "No products found.") {
    if (!target) return;
    target.innerHTML = items.length ? items.map(productCard).join("") : `<div class="empty-state"><i class="bi bi-search"></i><h2>Nothing here just yet</h2><p>${emptyMessage}</p><a class="btn-outline-shop" href="products.html">Browse all products</a></div>`;
    target.querySelectorAll(".product-media img").forEach(image => {
      if (image.complete) return;
      const media = image.closest(".product-media");
      media.classList.add("is-loading");
      image.addEventListener("load", () => media.classList.remove("is-loading"), { once: true });
      image.addEventListener("error", () => media.classList.remove("is-loading"), { once: true });
    });
    if (window.Northstar && window.Northstar.observeReveals) window.Northstar.observeReveals(target);
  }

  function renderHomeGrids() {
    document.querySelectorAll("[data-product-grid]").forEach(grid => {
      const mode = grid.dataset.productGrid;
      const selection = {
        featured: products.slice(0, 4),
        bestsellers: products.filter(item => item.tag === "Bestseller").slice(0, 4),
        deals: products.filter(item => item.tag === "Deal").slice(0, 4),
        new: products.filter(item => item.tag === "New" || item.tag === "Just in").slice(0, 4)
      }[mode] || products.slice(0, 4);
      renderCards(selection, grid);
    });
  }

  function mountCatalog() {
    const grid = document.getElementById("catalog-grid");
    if (!grid) return;
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q") || "";
    const category = params.get("category") || "";
    const search = document.getElementById("catalog-search");
    const categoryFilter = document.getElementById("category-filter");
    const sort = document.getElementById("catalog-sort");
    if (search) search.value = query;
    if (categoryFilter) categoryFilter.value = category;
    if (sort && params.get("sort")) sort.value = params.get("sort");

    const refresh = () => {
      const term = (search?.value || "").trim().toLowerCase();
      const activeCategory = categoryFilter?.value || "";
      const priceLimit = document.querySelector("input[name='price-range']:checked")?.value || "";
      let results = products.filter(item => {
        const matchesText = `${item.title} ${item.category} ${item.description}`.toLowerCase().includes(term);
        const matchesCategory = !activeCategory || item.category === activeCategory;
        const matchesPrice = !priceLimit || item.price <= Number(priceLimit);
        return matchesText && matchesCategory && matchesPrice;
      });
      switch (sort?.value) {
        case "price-low": results.sort((a, b) => a.price - b.price); break;
        case "price-high": results.sort((a, b) => b.price - a.price); break;
        case "rating": results.sort((a, b) => b.rating - a.rating); break;
        case "new": results.sort((a, b) => b.created - a.created); break;
        case "deal": results.sort((a, b) => (1 - b.price / b.oldPrice) - (1 - a.price / a.oldPrice)); break;
      }
      const count = document.getElementById("catalog-result-count");
      if (count) count.textContent = `${results.length} ${results.length === 1 ? "item" : "items"}`;
      renderCards(results, grid, "Try another search or adjust your filters.");
    };
    [search, categoryFilter, sort].filter(Boolean).forEach(control => control.addEventListener(control === search ? "input" : "change", refresh));
    document.querySelectorAll("input[name='price-range']").forEach(control => control.addEventListener("change", refresh));
    document.getElementById("clear-filters")?.addEventListener("click", () => {
      if (search) search.value = "";
      if (categoryFilter) categoryFilter.value = "";
      document.querySelectorAll("input[name='price-range']").forEach(control => { control.checked = false; });
      if (sort) sort.value = "featured";
      refresh();
    });
    refresh();
  }

  function renderDetail() {
    const target = document.getElementById("product-detail");
    if (!target) return;
    const id = new URLSearchParams(window.location.search).get("id");
    const item = products.find(product => product.id === id) || products[0];
    const discount = Math.round((1 - item.price / item.oldPrice) * 100);
    target.innerHTML = `<div class="detail-layout container-wide"><div><img class="detail-image" src="${item.image}" alt="${item.title}"></div><div class="detail-copy"><div class="breadcrumbs"><a href="index.html">Home</a><span>/</span><a href="products.html?category=${item.category}">${item.category}</a></div><span class="product-tag ${item.tag === "Deal" ? "deal" : ""}">${item.tag}</span><h1>${item.title}</h1><div class="product-rating"><i class="bi bi-star-fill"></i> ${item.rating} <span>· ${item.reviews.toLocaleString("en-IN")} verified reviews</span></div><div class="detail-price">${formatPrice(item.price)} <del>${formatPrice(item.oldPrice)}</del> <span class="product-discount">${discount}% off</span></div><p>${item.description}</p><ul><li>Carefully selected for everyday use</li><li>Complimentary delivery on orders over ₹2,000</li><li>30-day easy returns</li></ul><div class="detail-buttons"><button class="btn-primary-shop ripple" data-add-to-cart="${item.id}"><i class="bi bi-bag-plus"></i> Add to basket</button><button class="btn-outline-shop" data-toggle-wishlist="${item.id}"><i class="bi bi-heart"></i> Save for later</button></div><p class="form-note"><i class="bi bi-shield-check me-1"></i> Secure checkout and helpful support, whenever you need it.</p></div></div>`;
  }

  async function sync() {
    try {
      const response = await window.NorthstarApi.request("/products");
      if (Array.isArray(response?.products) && response.products.length) {
        products.splice(0, products.length, ...response.products);
        if (window.ShopPages) window.ShopPages.refreshCurrent();
      }
      return true;
    } catch {
      return false;
    }
  }

  function openQuickView(id) {
    const item = products.find(product => product.id === id);
    if (!item) return;
    const modal = document.getElementById("quick-view-modal");
    if (!modal) return;
    modal.innerHTML = `<div class="modal-dialog modal-lg modal-dialog-centered"><div class="modal-content"><div class="modal-header border-0 pb-0"><button type="button" class="btn-close ms-auto" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="quick-view-layout"><img src="${item.image}" alt="${item.title}"><div class="quick-view-copy"><div class="product-category">${item.category}</div><h2 id="quick-view-title">${item.title}</h2><div class="product-rating"><i class="bi bi-star-fill"></i> ${item.rating} <span>(${item.reviews.toLocaleString("en-IN")})</span></div><p class="detail-price">${formatPrice(item.price)} <del>${formatPrice(item.oldPrice)}</del></p><p>${item.description}</p><button class="btn-primary-shop w-100" data-add-to-cart="${item.id}" data-bs-dismiss="modal"><i class="bi bi-bag-plus"></i> Add to basket</button><a class="text-link mt-3" href="product-details.html?id=${item.id}">View full details <i class="bi bi-arrow-right"></i></a></div></div></div></div>`;
    bootstrap.Modal.getOrCreateInstance(modal).show();
  }

  window.ShopProducts = { products, formatPrice, productCard, renderCards, renderHomeGrids, mountCatalog, renderDetail, openQuickView, sync };
})();