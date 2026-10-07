(function () {
  const page = document.body.dataset.page || "home";
  const pageTitles = {
    home: "Find your next favorite",
    products: "Shop all products",
    categories: "Shop by category",
    "product-details": "Product details",
    cart: "Your shopping cart",
    wishlist: "Your wishlist",
    checkout: "Secure checkout",
    "order-success": "Order confirmed",
    login: "Welcome back",
    signup: "Create your account",
    about: "A better kind of everyday shopping",
    contact: "We're here to help",
    profile: "Your account",
    "not-found": "Page not found"
  };

  function imageUrl(id, width = 700) {
    return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=82`;
  }

  function headerTemplate() {
    return `
      <div class="topline">Complimentary delivery on orders over ₹2,000 <span class="mx-2">·</span> Thoughtful finds, made easy</div>
      <header class="main-header">
        <div class="container-wide header-main">
          <a class="brand" href="index.html" aria-label="Northstar Market home"><span class="brand-mark"><i class="bi bi-compass-fill"></i></span><span class="brand-text">northstar<span>.</span><small class="delivery-note">A little better, every day</small></span></a>
          <form class="search-wrap" id="site-search" role="search"><select class="search-category" aria-label="Search department" name="category"><option value="">All departments</option><option>Tech</option><option>Home</option><option>Style</option><option>Outdoor</option></select><input class="search-input" name="q" type="search" placeholder="Search Northstar Market" aria-label="Search products"><button class="search-submit" aria-label="Search"><i class="bi bi-search"></i></button></form>
          <div class="header-actions">
            <button class="header-action" type="button" data-theme-toggle aria-label="Toggle dark mode" aria-pressed="false"><i class="bi bi-moon-stars"></i><span>Dark mode</span></button>
            <a class="header-action" href="profile.html" aria-label="Your account"><i class="bi bi-person-circle"></i><span><small>Hello, sign in</small><strong>Account</strong></span></a>
            <a class="header-action" href="wishlist.html" aria-label="Wishlist"><i class="bi bi-heart"></i><span class="count-badge" data-wishlist-count>0</span><span><small>Saved</small><strong>Wishlist</strong></span></a>
            <a class="header-action" href="cart.html" aria-label="Shopping cart"><i class="bi bi-bag"></i><span class="count-badge" data-cart-count>0</span><span><small>Your</small><strong>Basket</strong></span></a>
            <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Toggle menu" aria-expanded="false"><i class="bi bi-list"></i></button>
          </div>
        </div>
        <nav class="nav-bar" id="site-nav" aria-label="Main navigation"><div class="container-wide nav-inner"><a class="nav-link" href="categories.html"><i class="bi bi-grid"></i>All categories</a><a class="nav-link" href="products.html?category=Tech">Tech</a><a class="nav-link" href="products.html?category=Home">Home</a><a class="nav-link" href="products.html?category=Style">Style</a><a class="nav-link" href="products.html?category=Outdoor">Outdoor</a><a class="nav-link" href="about.html">Our story</a><a class="nav-link nav-deal" href="products.html?sort=deal"><i class="bi bi-lightning-charge-fill"></i>Today's finds</a></div></nav>
      </header>`;
  }

  function footerTemplate() {
    return `<footer class="site-footer"><div class="container-wide"><div class="footer-grid"><div class="footer-about"><a class="brand" href="index.html"><span class="brand-mark"><i class="bi bi-compass-fill"></i></span><span class="brand-text">northstar<span>.</span></span></a><p>Useful things, well chosen. Explore the everyday essentials and thoughtful discoveries you'll reach for again and again.</p><div class="footer-social"><a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a><a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a><a href="#" aria-label="Pinterest"><i class="bi bi-pinterest"></i></a></div></div><div><h2 class="footer-title">Explore</h2><ul class="footer-links"><li><a href="products.html">All products</a></li><li><a href="categories.html">Categories</a></li><li><a href="products.html?sort=deal">Today's finds</a></li><li><a href="wishlist.html">Your wishlist</a></li></ul></div><div><h2 class="footer-title">Northstar</h2><ul class="footer-links"><li><a href="about.html">Our story</a></li><li><a href="contact.html">Contact us</a></li><li><a href="profile.html">Your account</a></li><li><a href="login.html">Sign in</a></li></ul></div><div><h2 class="footer-title">Here to help</h2><ul class="footer-links"><li><a href="contact.html">Shipping & returns</a></li><li><a href="contact.html">FAQs</a></li><li><a href="contact.html">Track an order</a></li><li><a href="mailto:hello@northstarmarket.example">hello@northstarmarket.example</a></li></ul></div></div><div class="footer-bottom"><span>© <span id="footer-year"></span> Northstar Market. Good things, thoughtfully found.</span><span>Secure payments <i class="bi bi-shield-check ms-1"></i> &nbsp; <i class="bi bi-credit-card"></i> &nbsp; <i class="bi bi-paypal"></i></span></div></div></footer>`;
  }

  function addMegaMenu() {
    const categoryLink = document.querySelector('.nav-inner > a[href="categories.html"]');
    if (!categoryLink) return;
    const department = document.createElement("div");
    department.className = "nav-department";
    categoryLink.parentNode.insertBefore(department, categoryLink);
    department.append(categoryLink);
    department.insertAdjacentHTML("beforeend", `<div class="mega-menu" aria-label="Shop departments"><section><h2>Tech</h2><a href="products.html?category=Tech">Headphones & sound</a><a href="products.html?category=Tech">Cameras & accessories</a><a href="products.html?category=Tech">Smart everyday</a></section><section><h2>Home</h2><a href="products.html?category=Home">Lighting & comfort</a><a href="products.html?category=Home">Coffee & kitchen</a><a href="products.html?category=Home">Desk essentials</a></section><section><h2>Style</h2><a href="products.html?category=Style">Bags & carry</a><a href="products.html?category=Style">Watches & accessories</a><a href="products.html?category=Style">Everyday care</a></section><section><h2>Outdoor</h2><a href="products.html?category=Outdoor">Trail essentials</a><a href="products.html?category=Outdoor">Travel & weekend</a><a href="products.html?category=Outdoor">Drinkware</a></section><a class="mega-feature" href="products.html?sort=new"><img loading="lazy" src="${imageUrl("photo-1472396961693-142e6e269027", 640)}" alt="Explore new outdoor finds"><span><strong>A little further out</strong><small>See the latest arrivals <i class="bi bi-arrow-right"></i></small></span></a></div>`);
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  }

  function pageHeading(title, description, trail = "Home") {
    return `<section class="page-heading"><div class="container-wide"><div class="breadcrumbs"><a href="index.html">${escapeHtml(trail)}</a><span>/</span><span>${escapeHtml(title)}</span></div><h1>${escapeHtml(title)}</h1>${description ? `<p>${escapeHtml(description)}</p>` : ""}</div></section>`;
  }

  function homeView() {
    return `<div class="page-enter">
      <section class="hero" aria-label="Featured collection"><img class="hero-image" src="${imageUrl("photo-1498049794561-7780e7231661", 1800)}" alt="Modern home with thoughtful technology and ambient lighting"><div class="container-wide"><div class="hero-content"><span class="hero-kicker"><i class="bi bi-stars"></i> The Northstar edit · 01</span><h1>Small upgrades.<br>Better everyday.</h1><p>Find beautifully useful things for the spaces you live in, the places you go, and everything in between.</p><a class="btn-primary-shop ripple" href="products.html">Explore the edit <i class="bi bi-arrow-right"></i></a></div></div><div class="hero-dots" aria-label="Choose featured slide"><button class="hero-dot active" aria-label="Featured collection one"></button><button class="hero-dot" aria-label="Featured collection two"></button><button class="hero-dot" aria-label="Featured collection three"></button></div><div class="hero-controls"><button class="hero-control" data-hero-prev aria-label="Previous slide"><i class="bi bi-arrow-left"></i></button><button class="hero-control" data-hero-next aria-label="Next slide"><i class="bi bi-arrow-right"></i></button></div></section>
      <div class="benefit-strip"><div class="container-wide d-contents"><div class="benefit"><i class="bi bi-truck"></i><div><strong>Free delivery over ₹2,000</strong><small>On every order, every day</small></div></div><div class="benefit"><i class="bi bi-arrow-repeat"></i><div><strong>30-day easy returns</strong><small>Changed your mind? No problem</small></div></div><div class="benefit"><i class="bi bi-shield-check"></i><div><strong>Thoughtfully selected</strong><small>Quality we stand behind</small></div></div><div class="benefit"><i class="bi bi-headset"></i><div><strong>Real human support</strong><small>Here when you need us</small></div></div></div></div>
      <section class="section container-wide"><div class="section-heading"><div><p class="eyebrow">A good place to start</p><h2 class="section-title">Shop by mood</h2><p class="section-copy">The right thing for whatever's on your mind.</p></div><a class="text-link" href="categories.html">All categories <i class="bi bi-arrow-right"></i></a></div><div class="category-grid">${categoryTile("Tech", "Sound, screen & smart living", "photo-1498049794561-7780e7231661")}${categoryTile("Home", "Make room for comfort", "photo-1616486338812-3dadae4b4ace")}${categoryTile("Style", "Everyday, with intention", "photo-1529139574466-a303027c1d8b")}${categoryTile("Outdoor", "Take the long way round", "photo-1472396961693-142e6e269027")}</div></section>
      <section class="section-tight container-wide"><div class="section-heading"><div><p class="eyebrow">Picked for you</p><h2 class="section-title">Trending right now</h2><p class="section-copy">A few favorites our community keeps coming back to.</p></div><a class="text-link" href="products.html">Shop all <i class="bi bi-arrow-right"></i></a></div><div class="product-grid" data-product-grid="featured"></div></section>
      <section class="section container-wide"><div class="deal-banner"><div class="deal-copy"><p class="eyebrow">The little things add up</p><h2>Make your daily routine feel a little more special.</h2><p>Fresh picks for your favorite corner of home.</p><a class="btn-primary-shop" href="products.html?category=Home">Shop home <i class="bi bi-arrow-right"></i></a></div><img class="deal-image" src="${imageUrl("photo-1616486338812-3dadae4b4ace", 1000)}" alt="Warm, considered living room with comfortable seating"></div></section>
      <section class="section-tight container-wide"><div class="section-heading"><div><p class="eyebrow">Worth a closer look</p><h2 class="section-title">Best-loved finds</h2></div><a class="text-link" href="products.html?sort=rating">See best sellers <i class="bi bi-arrow-right"></i></a></div><div class="product-grid" data-product-grid="bestsellers"></div></section>
      <section class="section container-wide"><div class="section-heading"><div><p class="eyebrow">Little moment, big value</p><h2 class="section-title">Deals worth opening</h2><p class="section-copy">A few things you'll love, at prices you'll love even more.</p></div><a class="text-link" href="products.html?sort=deal">All offers <i class="bi bi-arrow-right"></i></a></div><div class="product-grid" data-product-grid="deals"></div></section>
      <section class="section-tight container-wide"><div class="section-heading"><div><p class="eyebrow">Just landed</p><h2 class="section-title">New arrivals</h2></div><a class="text-link" href="products.html?sort=new">See what's new <i class="bi bi-arrow-right"></i></a></div><div class="product-grid" data-product-grid="new"></div></section>
      <section class="section container-wide"><div class="section-heading"><div><p class="eyebrow">Kind words, real people</p><h2 class="section-title">A little love from our customers</h2></div></div><div class="review-grid"><article class="review-card"><div class="review-stars">★★★★★</div><p>“I was not expecting the packaging and quality to feel this considered. Already back for a second order.”</p><div class="review-person"><span class="review-avatar">AM</span><div><strong>Ananya M.</strong><small>Verified customer</small></div></div></article><article class="review-card"><div class="review-stars">★★★★★</div><p>“Easy to find exactly what I wanted, and delivery was quicker than expected. The little details matter.”</p><div class="review-person"><span class="review-avatar">RK</span><div><strong>Rohan K.</strong><small>Verified customer</small></div></div></article><article class="review-card"><div class="review-stars">★★★★★</div><p>“A refreshing shopping experience. The product is lovely and the support team actually cared.”</p><div class="review-person"><span class="review-avatar">SI</span><div><strong>Simran I.</strong><small>Verified customer</small></div></div></article></div></section>
      <section class="newsletter-band"><div class="container-wide newsletter-inner"><div><p class="eyebrow" style="color:#ffcf6b">A good email, occasionally</p><h2>Good finds, straight to your inbox.</h2><p>Sign up for new arrivals, small discoveries, and member-only offers.</p></div><form class="newsletter-form" id="newsletter-form"><input name="email" type="email" placeholder="Your email address" aria-label="Your email address" required><button type="submit">Count me in</button></form></div></section>
    </div>`;
  }

  function categoryTile(title, subtitle, image) {
    return `<a class="category-tile reveal" href="products.html?category=${encodeURIComponent(title)}"><img loading="lazy" src="${imageUrl(image, 640)}" alt="${title} collection"><div class="category-label"><div><h3>${title}</h3><span>${subtitle}</span></div><i class="bi bi-arrow-up-right"></i></div></a>`;
  }

  function productsView() {
    const categoryOptions = ["Tech", "Home", "Style", "Outdoor"].map(value => `<option value="${value}">${value}</option>`).join("");
    return `${pageHeading("All the good things", "Thoughtful picks for your everyday, in one easy place.")}<div class="container-wide catalog-layout"><aside class="filter-panel"><div class="filter-heading"><span>Refine your search</span><button class="btn btn-link btn-sm p-0 text-success" id="clear-filters">Clear</button></div><div class="filter-group"><h3>Find something</h3><input class="form-control form-control-sm" id="catalog-search" type="search" placeholder="Search products" aria-label="Search products"></div><div class="filter-group"><h3>Department</h3><select class="form-select form-select-sm" id="category-filter"><option value="">All departments</option>${categoryOptions}</select></div><div class="filter-group"><h3>Price</h3><label class="filter-option"><input type="radio" name="price-range" value="3000"> Under ₹3,000</label><label class="filter-option"><input type="radio" name="price-range" value="7000"> Under ₹7,000</label><label class="filter-option"><input type="radio" name="price-range" value="15000"> Under ₹15,000</label></div></aside><section aria-label="Product results"><div class="catalog-toolbar"><span class="catalog-count" id="catalog-result-count"></span><select class="catalog-sort" id="catalog-sort" aria-label="Sort products"><option value="featured">Sort: Featured</option><option value="price-low">Price: Low to high</option><option value="price-high">Price: High to low</option><option value="rating">Top rated</option><option value="new">Newest</option><option value="deal">Best deal</option></select></div><div class="catalog-grid" id="catalog-grid"></div></section></div>`;
  }

  function categoriesView() {
    return `${pageHeading("Find your kind of thing", "Browse considered essentials across the departments you love.")}<section class="section container-wide"><div class="category-grid">${categoryTile("Tech", "Smart, sound & useful", "photo-1498049794561-7780e7231661")}${categoryTile("Home", "Comfort, in good form", "photo-1616486338812-3dadae4b4ace")}${categoryTile("Style", "Pieces for every day", "photo-1529139574466-a303027c1d8b")}${categoryTile("Outdoor", "Made for the open air", "photo-1472396961693-142e6e269027")}</div><div class="section-heading mt-5"><div><p class="eyebrow">A few things to love</p><h2 class="section-title">Popular across Northstar</h2></div></div><div class="product-grid" data-product-grid="featured"></div></section>`;
  }

  function cartView() {
    const cart = window.ShopCart.getCart();
    const entries = cart.map(entry => ({ ...entry, product: window.ShopProducts.products.find(item => item.id === entry.id) })).filter(entry => entry.product);
    const subtotal = entries.reduce((sum, entry) => sum + entry.product.price * entry.quantity, 0);
    const delivery = subtotal === 0 || subtotal >= 2000 ? 0 : 99;
    return `${pageHeading("Your basket", "Everything you picked, right where you left it.")}<div class="container-wide cart-layout"><section class="cart-list"><div class="cart-list-heading">Basket <span class="catalog-count">(${entries.reduce((sum, entry) => sum + entry.quantity, 0)} items)</span></div>${entries.length ? entries.map(({ product, quantity }) => `<article class="cart-item"><a href="product-details.html?id=${product.id}"><img loading="lazy" src="${product.image}" alt="${product.title}"></a><div><h3><a href="product-details.html?id=${product.id}">${product.title}</a></h3><small>${product.category} · In stock</small><div class="cart-item-controls"><span class="quantity-control"><button aria-label="Decrease quantity" data-quantity-action="decrease" data-product-id="${product.id}">−</button><span>${quantity}</span><button aria-label="Increase quantity" data-quantity-action="increase" data-product-id="${product.id}">+</button></span><button class="remove-link" data-remove-cart="${product.id}">Remove</button></div></div><strong class="cart-line-price">${window.ShopProducts.formatPrice(product.price * quantity)}</strong></article>`).join("") : `<div class="empty-state"><i class="bi bi-bag"></i><h2>Your basket is taking a breather</h2><p>When something catches your eye, it will be waiting here.</p><a class="btn-primary-shop" href="products.html">Explore products</a></div>`}</section><aside class="summary-panel"><h2>Order summary</h2><div class="summary-row"><span>Subtotal</span><strong>${window.ShopProducts.formatPrice(subtotal)}</strong></div><div class="summary-row"><span>Delivery</span><strong>${delivery ? window.ShopProducts.formatPrice(delivery) : "Free"}</strong></div><div class="summary-row"><span>Taxes</span><span>Included</span></div><div class="summary-row summary-total"><span>Total</span><strong>${window.ShopProducts.formatPrice(subtotal + delivery)}</strong></div><a class="btn-primary-shop" href="${entries.length ? "checkout.html" : "products.html"}">${entries.length ? "Continue to checkout" : "Start shopping"} <i class="bi bi-arrow-right"></i></a><p class="form-note mt-3 mb-0"><i class="bi bi-shield-check me-1"></i> Your details are protected at checkout.</p></aside></div>`;
  }

  function wishlistView() {
    return `${pageHeading("Saved for later", "Your favorites, all together. Move anything to your basket whenever you're ready.")}<section class="section container-wide"><div class="product-grid" id="wishlist-grid"></div></section>`;
  }

  function checkoutView() {
    const cart = window.ShopCart.getCart();
    const entries = cart.map(entry => ({ ...entry, product: window.ShopProducts.products.find(item => item.id === entry.id) })).filter(entry => entry.product);
    const subtotal = entries.reduce((sum, entry) => sum + entry.product.price * entry.quantity, 0);
    const delivery = subtotal === 0 || subtotal >= 2000 ? 0 : 99;
    return `${pageHeading("Secure checkout", "A few details and your order will be on its way.")}<div class="container-wide checkout-layout"><form class="form-card" id="checkout-form"><section class="checkout-section"><h2><span class="text-success me-2">01</span>Delivery address</h2><div class="row g-3"><div class="col-sm-6"><label class="form-label" for="shipping-name">Full name</label><input class="form-control" id="shipping-name" name="name" autocomplete="name" required></div><div class="col-sm-6"><label class="form-label" for="shipping-phone">Phone number</label><input class="form-control" id="shipping-phone" name="phone" type="tel" autocomplete="tel" pattern="[0-9]{8,15}" required></div><div class="col-12"><label class="form-label" for="shipping-address">Street address</label><input class="form-control" id="shipping-address" name="address" autocomplete="street-address" required></div><div class="col-sm-5"><label class="form-label" for="shipping-city">City</label><input class="form-control" id="shipping-city" name="city" autocomplete="address-level2" required></div><div class="col-sm-4"><label class="form-label" for="shipping-state">State</label><input class="form-control" id="shipping-state" name="state" autocomplete="address-level1" required></div><div class="col-sm-3"><label class="form-label" for="shipping-postal">PIN code</label><input class="form-control" id="shipping-postal" name="postal" autocomplete="postal-code" pattern="[0-9]{6}" required></div></div></section><section class="checkout-section mt-4"><h2><span class="text-success me-2">02</span>Payment method</h2><label class="payment-option"><input type="radio" name="payment" value="card" required><span><strong>Credit or debit card</strong><small>Visa, Mastercard, RuPay</small></span><i class="bi bi-credit-card ms-auto"></i></label><label class="payment-option"><input type="radio" name="payment" value="upi"><span><strong>UPI</strong><small>Pay using your preferred UPI app</small></span><i class="bi bi-phone ms-auto"></i></label><label class="payment-option"><input type="radio" name="payment" value="cod"><span><strong>Cash on delivery</strong><small>Pay when your order arrives</small></span><i class="bi bi-cash-coin ms-auto"></i></label></section><button class="btn-primary-shop ripple mt-3" type="submit"><i class="bi bi-lock"></i> Place your order</button><p class="form-note mt-3">Demo checkout: no payment will be collected.</p></form><aside class="summary-panel"><h2>Your order</h2>${entries.map(entry => `<div class="summary-row"><span>${entry.product.title} × ${entry.quantity}</span><strong>${window.ShopProducts.formatPrice(entry.product.price * entry.quantity)}</strong></div>`).join("") || `<p class="form-note">Your basket is empty.</p>`}<div class="summary-row"><span>Delivery</span><strong>${delivery ? window.ShopProducts.formatPrice(delivery) : "Free"}</strong></div><div class="summary-row summary-total"><span>Total</span><strong>${window.ShopProducts.formatPrice(subtotal + delivery)}</strong></div></aside></div>`;
  }

  function authView(signup) {
    const title = signup ? "Create your account" : "Welcome back";
    return `<div class="auth-layout"><section class="auth-art"><img src="${imageUrl("photo-1441986300917-64674bd600d8", 1000)}" alt="Warmly lit Northstar Market storefront"><div class="auth-art-copy"><p class="eyebrow" style="color:#ffcf6b">Thoughtfully found</p><h2>Good things begin here.</h2><p>Keep your favorites close and your next discovery even closer.</p></div></section><section class="auth-form-wrap"><h1>${title}</h1><p>${signup ? "Join Northstar for a more considered kind of shopping." : "Sign in to keep your Northstar finds close."}</p><div class="social-buttons"><button class="social-button" type="button" data-social-login><i class="bi bi-google me-2"></i>Continue with Google</button><button class="social-button" type="button" data-social-login><i class="bi bi-apple me-2"></i>Continue with Apple</button></div><div class="divider">or use your email</div><form id="${signup ? "signup-form" : "login-form"}" novalidate>${signup ? `<div class="mb-3"><label class="form-label" for="full-name">Full name</label><input class="form-control" id="full-name" name="fullName" autocomplete="name" minlength="2" required><div class="invalid-feedback">Enter your name.</div></div>` : ""}<div class="mb-3"><label class="form-label" for="auth-email">Email address</label><input class="form-control" id="auth-email" name="email" type="email" autocomplete="email" required><div class="invalid-feedback">Enter a valid email address.</div></div>${signup ? `<div class="mb-3"><label class="form-label" for="auth-phone">Phone number</label><input class="form-control" id="auth-phone" name="phone" type="tel" autocomplete="tel" pattern="[0-9]{8,15}" required><div class="invalid-feedback">Enter a valid phone number.</div></div>` : ""}<div class="mb-3"><label class="form-label" for="auth-password">Password</label><input class="form-control" id="auth-password" name="password" type="password" autocomplete="${signup ? "new-password" : "current-password"}" minlength="8" required><div class="invalid-feedback">Use at least 8 characters.</div></div>${signup ? `<div class="mb-3"><label class="form-label" for="confirm-password">Confirm password</label><input class="form-control" id="confirm-password" name="confirmPassword" type="password" autocomplete="new-password" minlength="8" required><div class="invalid-feedback">Make sure both passwords match.</div></div><label class="check-line mb-3"><input type="checkbox" name="terms" required><span>I agree to the <a class="text-success fw-bold" href="about.html">terms and conditions</a>.</span></label>` : `<div class="d-flex align-items-center justify-content-between mb-3"><label class="check-line"><input type="checkbox" name="remember"><span>Remember me</span></label><a class="text-link" href="#" data-forgot-password>Forgot password?</a></div>`}<button class="btn-primary-shop ripple w-100" type="submit">${signup ? "Create account" : "Sign in"} <i class="bi bi-arrow-right"></i></button></form><p class="form-note text-center mt-4 mb-0">${signup ? "Already have an account?" : "New to Northstar?"} <a class="text-link" href="${signup ? "login.html" : "signup.html"}">${signup ? "Sign in" : "Create an account"}</a></p><p class="form-note text-center mt-3">Demo interface. Authentication is not connected to a secure service.</p></section></div>`;
  }

  function contactView() {
    return `${pageHeading("A real person is just a message away", "Questions about a product, an order, or anything else? We'll help you sort it.")}<div class="container-wide contact-layout"><aside class="content-panel"><h2 class="section-title" style="font-size:23px">Let's talk</h2><p class="section-copy">Our small support team is here Monday to Saturday, 9am–6pm IST.</p><div class="contact-method"><i class="bi bi-envelope"></i><div><strong>Email</strong><small>hello@northstarmarket.example</small></div></div><div class="contact-method"><i class="bi bi-telephone"></i><div><strong>Call</strong><small>+91 80000 12345</small></div></div><div class="contact-method"><i class="bi bi-geo-alt"></i><div><strong>Visit</strong><small>12 Market Lane, Bengaluru, India</small></div></div></aside><form class="form-card" id="contact-form" novalidate><h2 class="section-title" style="font-size:23px">Send us a note</h2><p class="section-copy mb-4">We usually reply within one business day.</p><div class="row g-3"><div class="col-sm-6"><label class="form-label" for="contact-name">Your name</label><input class="form-control" id="contact-name" name="name" required></div><div class="col-sm-6"><label class="form-label" for="contact-email">Email address</label><input class="form-control" id="contact-email" name="email" type="email" required></div><div class="col-12"><label class="form-label" for="contact-topic">What can we help with?</label><select class="form-select" id="contact-topic" name="topic"><option>Product question</option><option>Order and delivery</option><option>Returns</option><option>Something else</option></select></div><div class="col-12"><label class="form-label" for="contact-message">Your message</label><textarea class="form-control" id="contact-message" name="message" rows="5" minlength="10" required></textarea></div><div class="col-12"><button class="btn-primary-shop ripple" type="submit">Send message <i class="bi bi-arrow-right"></i></button></div></div></form></div>`;
  }

  function aboutView() {
    return `${pageHeading("A better kind of everyday shopping", "Northstar is for the things you use, the places you go, and the small details that make a day feel good.")}<section class="container-wide about-feature"><img src="${imageUrl("photo-1441986300917-64674bd600d8", 1000)}" alt="A thoughtful independent retail space"><div><p class="eyebrow">Why Northstar</p><h2>Less scrolling. Better finding.</h2><p>We think the things we bring into our lives should earn their place. Northstar brings together useful design, considered quality, and everyday value, all chosen with a little more care.</p><p>We're building a calmer way to shop online: clear choices, honest details, and people to help when you need them.</p><a class="btn-primary-shop mt-2" href="products.html">Explore our picks <i class="bi bi-arrow-right"></i></a><div class="stat-row"><div class="stat-item"><strong data-counter="16">16</strong><span>thoughtful collections</span></div><div class="stat-item"><strong data-counter="30">30</strong><span>days to return</span></div><div class="stat-item"><strong data-counter="24">24/7</strong><span>shop at your pace</span></div></div></div></section>`;
  }

  function profileView() {
    const user = window.ShopAuth.currentUser();
    if (!user) return `${pageHeading("Your Northstar account", "Sign in or create an account to keep your details together.")}<section class="section container-wide text-center"><i class="bi bi-person-circle display-3 text-success"></i><h2 class="section-title mt-3">Your account starts here</h2><p class="section-copy mb-4">Save your favorites and check in on your recent orders.</p><a class="btn-primary-shop me-2" href="login.html">Sign in</a><a class="btn-outline-shop" href="signup.html">Create account</a></section>`;
    const safeName = escapeHtml(user.name);
    const safeEmail = escapeHtml(user.email);
    const safePhone = escapeHtml(user.phone || "Not added");
    const orders = JSON.parse(localStorage.getItem("northstarOrders") || "[]");
    return `${pageHeading("Your account", `Good to see you, ${user.name}.`)}<div class="container-wide profile-layout"><nav class="profile-nav" aria-label="Account sections"><a class="active" href="profile.html"><i class="bi bi-person"></i> Overview</a><a href="wishlist.html"><i class="bi bi-heart"></i> Saved items</a><a href="cart.html"><i class="bi bi-bag"></i> Basket</a><a href="#" data-sign-out><i class="bi bi-box-arrow-right"></i> Sign out</a></nav><section class="content-panel"><h2 class="section-title" style="font-size:23px">Your details</h2><div class="order-row"><span>Name</span><strong>${safeName}</strong></div><div class="order-row"><span>Email</span><strong>${safeEmail}</strong></div><div class="order-row"><span>Phone</span><strong>${safePhone}</strong></div><h2 class="section-title mt-4" style="font-size:21px">Recent orders</h2>${orders.length ? orders.slice(0, 5).map(order => `<div class="order-row"><span>Order ${escapeHtml(order.id)} · ${new Date(order.date).toLocaleDateString()}</span><strong>${window.ShopProducts.formatPrice(order.total)}</strong></div>`).join("") : `<p class="section-copy">No orders yet. The good stuff is waiting to be found.</p><a class="text-link" href="products.html">Browse products <i class="bi bi-arrow-right"></i></a>`}</section></div>`;
  }

  function successView() {
    const order = JSON.parse(localStorage.getItem("northstarLastOrder") || "null");
    return `<section class="success-panel page-enter"><div class="success-mark"><i class="bi bi-check2"></i></div><p class="eyebrow">All set</p><h1>Good things are on the way.</h1><p>Your order${order ? ` <strong>${escapeHtml(order.id)}</strong>` : ""} is confirmed. We'll send your details to your inbox and keep you posted as it makes its way to you.</p><a class="btn-primary-shop" href="products.html">Keep exploring <i class="bi bi-arrow-right"></i></a><a class="text-link d-block mt-3" href="profile.html">View your account</a></section>`;
  }

  function notFoundView() {
    return `<section class="error-page"><div><p class="error-code">404</p><h1>Looks like this page wandered off.</h1><p>The link may be old, or the page may have moved. Let's get you back to the good stuff.</p><a class="btn-primary-shop" href="index.html">Back to Northstar <i class="bi bi-arrow-right"></i></a></div></section>`;
  }

  function pageView() {
    const views = {
      home: homeView,
      products: productsView,
      categories: categoriesView,
      "product-details": () => `${pageHeading("Product details", "A closer look at a considered find.")}<div id="product-detail"></div>`,
      cart: cartView,
      wishlist: wishlistView,
      checkout: checkoutView,
      "order-success": successView,
      login: () => authView(false),
      signup: () => authView(true),
      about: aboutView,
      contact: contactView,
      profile: profileView,
      "not-found": notFoundView
    };
    return (views[page] || notFoundView)();
  }

  function initPage() {
    if (page === "products") window.ShopProducts.mountCatalog();
    if (page === "product-details") window.ShopProducts.renderDetail();
    if (page === "wishlist") window.ShopProducts.renderCards(window.ShopProducts.products.filter(item => window.ShopCart.getWishlist().includes(item.id)), document.getElementById("wishlist-grid"), "Save a few favorites and they'll show up here.");
    if (page === "login" || page === "signup") window.ShopAuth.init();
    if (page === "checkout") {
      const user = window.ShopAuth.currentUser();
      if (user) {
        const name = document.getElementById("shipping-name");
        const phone = document.getElementById("shipping-phone");
        if (name) name.value = user.name || "";
        if (phone) phone.value = user.phone || "";
      }
      document.getElementById("checkout-form").addEventListener("submit", async event => {
        event.preventDefault();
        event.currentTarget.classList.add("was-validated");
        if (!event.currentTarget.checkValidity()) return;
        const basket = window.ShopCart.getCart();
        if (!basket.length) {
          showToast("Your basket is empty", "Add something before checking out.");
          return;
        }
        let order;
        const details = Object.fromEntries(new FormData(event.currentTarget).entries());
        try {
          const response = await window.NorthstarApi.request("/orders", { method: "POST", body: JSON.stringify(details) });
          order = response.order;
        } catch (error) {
          if (!window.NorthstarApi.isUnavailable(error)) {
            showToast("Could not place your order", error.message);
            return;
          }
          const total = basket.reduce((sum, entry) => {
            const product = window.ShopProducts.products.find(item => item.id === entry.id);
            return sum + (product ? product.price * entry.quantity : 0);
          }, 0);
          order = { id: `NS-${Date.now().toString().slice(-8)}`, date: new Date().toISOString(), total, items: basket };
        }
        const orders = JSON.parse(localStorage.getItem("northstarOrders") || "[]");
        orders.unshift(order);
        localStorage.setItem("northstarOrders", JSON.stringify(orders));
        localStorage.setItem("northstarLastOrder", JSON.stringify(order));
        localStorage.removeItem("northstarCart");
        window.location.href = "order-success.html";
      });
    }
    if (page === "contact") {
      document.getElementById("contact-form").addEventListener("submit", async event => {
        event.preventDefault();
        event.currentTarget.classList.add("was-validated");
        if (!event.currentTarget.checkValidity()) return;
        const form = event.currentTarget;
        const payload = Object.fromEntries(new FormData(form).entries());
        try {
          await window.NorthstarApi.request("/contact", { method: "POST", body: JSON.stringify(payload) });
        } catch (error) {
          if (!window.NorthstarApi.isUnavailable(error)) return showToast("Message not sent", error.message);
        }
        form.reset();
        showToast("Message received", "Thanks for reaching out. We'll be in touch soon.");
      });
    }
    document.querySelector("[data-sign-out]")?.addEventListener("click", async event => {
      event.preventDefault();
      try { await window.NorthstarApi.request("/auth/logout", { method: "POST" }); } catch { /* Static preview has no session endpoint. */ }
      localStorage.removeItem("northstarUser");
      window.location.href = "index.html";
    });
    if (page === "profile") {
      window.NorthstarApi.request("/orders").then(response => {
        localStorage.setItem("northstarOrders", JSON.stringify(response.orders || []));
        window.ShopPages.refreshCurrent();
      }).catch(() => {});
    }
    document.querySelectorAll("[data-counter]").forEach(counter => {
      const goal = Number(counter.dataset.counter);
      let current = 0;
      const timer = window.setInterval(() => {
        current += Math.max(1, Math.ceil(goal / 18));
        if (current >= goal) { current = goal; window.clearInterval(timer); }
        counter.textContent = `${current}${goal === 24 ? "/7" : "+"}`;
      }, 55);
    });
  }

  function renderContent() {
    const content = document.getElementById("page-content");
    content.classList.remove("page-enter");
    content.innerHTML = pageView();
    void content.offsetWidth;
    content.classList.add("page-enter");
    if (page === "home" || page === "categories") window.ShopProducts.renderHomeGrids();
    initPage();
    observeReveals();
  }

  function render() {
    document.title = `${pageTitles[page] || "Page not found"} | Northstar Market`;
    document.body.classList.toggle("dark-mode", localStorage.getItem("northstarTheme") === "dark");
    document.getElementById("site-header").innerHTML = headerTemplate();
    addMegaMenu();
    document.getElementById("site-footer").innerHTML = footerTemplate();
    const themeToggle = document.querySelector("[data-theme-toggle]");
    const isDark = document.body.classList.contains("dark-mode");
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.innerHTML = `<i class="bi bi-${isDark ? "sun" : "moon-stars"}"></i><span> ${isDark ? "Light" : "Dark"} mode</span>`;
    document.getElementById("footer-year").textContent = new Date().getFullYear();
    renderContent();
    if (window.ShopCart) window.ShopCart.updateBadges();
    bindGlobalEvents();
    observeReveals();
    window.ShopProducts.sync();
    window.ShopCart.sync();
    window.ShopAuth.syncCurrentUser();
  }

  function bindGlobalEvents() {
    const menuToggle = document.getElementById("mobile-menu-toggle");
    menuToggle.addEventListener("click", () => {
      const nav = document.getElementById("site-nav");
      const open = nav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.innerHTML = `<i class="bi bi-${open ? "x-lg" : "list"}"></i>`;
    });
    document.getElementById("site-search").addEventListener("submit", event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const query = String(form.get("q") || "").trim();
      const category = String(form.get("category") || "");
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (category) params.set("category", category);
      window.location.href = `products.html?${params.toString()}`;
    });
    document.getElementById("newsletter-form")?.addEventListener("submit", async event => {
      event.preventDefault();
      const form = event.currentTarget;
      const email = new FormData(form).get("email");
      try {
        await window.NorthstarApi.request("/newsletter", { method: "POST", body: JSON.stringify({ email }) });
      } catch (error) {
        if (!window.NorthstarApi.isUnavailable(error)) return showToast("Could not subscribe", error.message);
        const subscribers = JSON.parse(localStorage.getItem("northstarSubscribers") || "[]");
        if (!subscribers.includes(email)) subscribers.push(email);
        localStorage.setItem("northstarSubscribers", JSON.stringify(subscribers));
      }
      form.reset();
      showToast("You're on the list", "We'll send the good stuff, not the noise.");
    });
    document.querySelectorAll("[data-theme-toggle]").forEach(button => button.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const dark = document.body.classList.contains("dark-mode");
      localStorage.setItem("northstarTheme", dark ? "dark" : "light");
      button.setAttribute("aria-pressed", String(dark));
      button.innerHTML = `<i class="bi bi-${dark ? "sun" : "moon-stars"}"></i><span> ${dark ? "Light" : "Dark"} mode</span>`;
    }));
    const slides = [
        { title: "Small upgrades.<br>Better everyday.", copy: "Find beautifully useful things for the spaces you live in, the places you go, and everything in between.", image: "photo-1498049794561-7780e7231661", kicker: "The Northstar edit · 01" },
        { title: "Make room for<br>a softer landing.", copy: "Comfortable, considered pieces to help your home feel a little more like yours.", image: "photo-1616486338812-3dadae4b4ace", kicker: "A little more at home · 02" },
        { title: "Out there is<br>closer than you think.", copy: "Lightweight essentials for a slow morning, a new trail, or the long way home.", image: "photo-1472396961693-142e6e269027", kicker: "Get outside · 03" }
    ];
    const setHeroSlide = index => {
      document.querySelectorAll(".hero-dot").forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === index));
      const hero = document.querySelector(".hero");
      if (!hero) return;
      hero.querySelector("h1").innerHTML = slides[index].title;
      hero.querySelector(".hero-content > p").textContent = slides[index].copy;
      hero.querySelector(".hero-kicker").innerHTML = `<i class="bi bi-stars"></i> ${slides[index].kicker}`;
      hero.querySelector(".hero-image").src = imageUrl(slides[index].image, 1800);
    };
    document.querySelectorAll("[data-hero-next], [data-hero-prev]").forEach(button => button.addEventListener("click", () => {
      const activeIndex = [...document.querySelectorAll(".hero-dot")].findIndex(dot => dot.classList.contains("active"));
      const step = button.hasAttribute("data-hero-next") ? 1 : -1;
      setHeroSlide((activeIndex + step + slides.length) % slides.length);
    }));
    document.querySelectorAll(".hero-dot").forEach((dot, index) => dot.addEventListener("click", () => setHeroSlide(index)));
    document.addEventListener("click", event => {
      const addButton = event.target.closest("[data-add-to-cart]");
      const wishButton = event.target.closest("[data-toggle-wishlist]");
      const quickButton = event.target.closest("[data-quick-view]");
      if (addButton && window.ShopCart) window.ShopCart.add(addButton.dataset.addToCart);
      if (wishButton && window.ShopCart) window.ShopCart.toggleWishlist(wishButton.dataset.toggleWishlist);
      if (quickButton && window.ShopProducts) window.ShopProducts.openQuickView(quickButton.dataset.quickView);
      const quantityButton = event.target.closest("[data-quantity-action]");
      if (quantityButton && window.ShopCart) window.ShopCart.changeQuantity(quantityButton.dataset.productId, quantityButton.dataset.quantityAction);
      const removeButton = event.target.closest("[data-remove-cart]");
      if (removeButton && window.ShopCart) window.ShopCart.remove(removeButton.dataset.removeCart);
    });
    window.addEventListener("scroll", () => document.getElementById("back-to-top").classList.toggle("visible", window.scrollY > 500));
    document.getElementById("back-to-top").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  function observeReveals() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal, .reveal-left, .reveal-zoom").forEach(node => node.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: .12 });
    document.querySelectorAll(".reveal, .reveal-left, .reveal-zoom").forEach(node => observer.observe(node));
  }

  function showToast(title, message) {
    const container = document.getElementById("toast-region");
    const element = document.createElement("div");
    element.className = "toast align-items-center text-bg-light";
    element.setAttribute("role", "status");
    element.innerHTML = `<div class="d-flex"><div class="toast-body"><strong>${escapeHtml(title)}</strong><br>${escapeHtml(message)}</div><button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div>`;
    container.append(element);
    bootstrap.Toast.getOrCreateInstance(element, { delay: 3200 }).show();
    element.addEventListener("hidden.bs.toast", () => element.remove());
  }

  window.Northstar = { imageUrl, pageHeading, showToast, observeReveals };
  window.ShopPages = { refreshCurrent: renderContent };
  document.body.insertAdjacentHTML("afterbegin", "<div class=\"page-loader\" id=\"page-loader\" aria-label=\"Loading Northstar Market\"><span class=\"loader-mark\"><i class=\"bi bi-compass-fill\"></i></span><span class=\"loading-dots\"><span></span><span></span><span></span></span></div>");
  window.setTimeout(() => document.getElementById("page-loader")?.classList.add("is-hidden"), 180);
  document.addEventListener("DOMContentLoaded", render);
})();