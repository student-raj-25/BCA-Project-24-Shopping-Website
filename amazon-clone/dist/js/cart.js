(function () {
  const CART_KEY = "northstarCart";
  const WISHLIST_KEY = "northstarWishlist";
  let localRevision = 0;

  function read(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || "null") || fallback; }
    catch { return fallback; }
  }

  function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
  const getCart = () => read(CART_KEY, []);
  const getWishlist = () => read(WISHLIST_KEY, []);

  function persist(path, method, body) {
    window.NorthstarApi.request(path, { method, ...(body ? { body: JSON.stringify(body) } : {}) }).catch(() => {});
  }

  async function sync() {
    const startRevision = localRevision;
    try {
      const [cart, wishlist] = await Promise.all([
        window.NorthstarApi.request("/cart"),
        window.NorthstarApi.request("/wishlist")
      ]);
      if (startRevision !== localRevision) return false;
      save(CART_KEY, cart.items || []);
      save(WISHLIST_KEY, wishlist.items || []);
      refreshPage();
      return true;
    } catch {
      return false;
    }
  }

  function updateBadges() {
    const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll("[data-cart-count]").forEach(node => { node.textContent = count; });
    document.querySelectorAll("[data-wishlist-count]").forEach(node => { node.textContent = getWishlist().length; });
  }

  function refreshPage() {
    updateBadges();
    if (window.ShopPages && window.ShopPages.refreshCurrent) window.ShopPages.refreshCurrent();
  }

  function add(id) {
    const product = window.ShopProducts.products.find(item => item.id === id);
    if (!product) return;
    const cart = getCart();
    const existing = cart.find(item => item.id === id);
    if (existing) existing.quantity += 1;
    else cart.push({ id, quantity: 1 });
    localRevision += 1;
    save(CART_KEY, cart);
    persist("/cart/items", "POST", { productId: id, quantity: 1 });
    refreshPage();
    window.Northstar.showToast("Added to your basket", product.title);
  }

  function remove(id) {
    localRevision += 1;
    save(CART_KEY, getCart().filter(item => item.id !== id));
    persist(`/cart/items/${encodeURIComponent(id)}`, "DELETE");
    refreshPage();
  }

  function changeQuantity(id, action) {
    const cart = getCart();
    const item = cart.find(entry => entry.id === id);
    if (!item) return;
    item.quantity += action === "increase" ? 1 : -1;
    const quantity = item.quantity;
    localRevision += 1;
    save(CART_KEY, cart.filter(entry => entry.quantity > 0));
    persist(`/cart/items/${encodeURIComponent(id)}`, "PATCH", { quantity: Math.max(quantity, 0) });
    refreshPage();
  }

  function toggleWishlist(id) {
    const wishlist = getWishlist();
    const index = wishlist.indexOf(id);
    if (index >= 0) wishlist.splice(index, 1);
    else wishlist.push(id);
    localRevision += 1;
    save(WISHLIST_KEY, wishlist);
    persist(index >= 0 ? `/wishlist/items/${encodeURIComponent(id)}` : "/wishlist/items", index >= 0 ? "DELETE" : "POST", index >= 0 ? null : { productId: id });
    refreshPage();
    const product = window.ShopProducts.products.find(item => item.id === id);
    window.Northstar.showToast(index >= 0 ? "Removed from wishlist" : "Saved for later", product?.title || "Your wishlist");
  }

  function isWishlisted(id) { return getWishlist().includes(id); }

  window.ShopCart = { getCart, getWishlist, updateBadges, add, remove, changeQuantity, toggleWishlist, isWishlisted, sync };
})();