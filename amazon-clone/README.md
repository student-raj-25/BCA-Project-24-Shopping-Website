# Northstar Market

A responsive multi-page storefront and Express API built with HTML, CSS, vanilla JavaScript, Bootstrap 5.3, and PostgreSQL.

## Run locally

Prerequisites: Node.js 20+ and Docker Desktop (for local PostgreSQL).

```powershell
Copy-Item .env.example .env
docker compose up -d database
npm install
npm run dev
```

Set a unique `SESSION_SECRET` in `.env` before starting the server. The app initializes the relational schema and seeds the 16-product catalog at startup. Open `http://localhost:3000`.

To use an existing local PostgreSQL or Neon database, set `DATABASE_URL` in `.env`; use `DATABASE_SSL=true` for Neon and `false` for local PostgreSQL. Do not commit `.env` or paste database credentials into chat.

## Database and API

The schema is in `server/schema.sql`. It stores users (bcrypt password hashes), products, guest/account carts, wishlists, orders and line items, contact messages, newsletter subscribers, and PostgreSQL-backed sessions. The Express API exposes `/api/health`, `/api/products`, `/api/auth/*`, `/api/cart`, `/api/wishlist`, `/api/orders`, `/api/contact`, and `/api/newsletter`.

The browser uses same-origin API requests and keeps a local preview fallback when opened through a static server without the API. When Express is running, PostgreSQL is the source of truth for commerce and account data.

## Free hosted option

1. Create a PostgreSQL project on [Neon](https://neon.com/) and copy its pooled connection string. Neon currently lists a permanent free plan with 1 GB storage per project and compute that scales to zero after inactivity; check its current quotas before launch.
2. Push this project to a Git repository and create a Render Blueprint using `render.yaml` (set the Blueprint path to `amazon-clone/render.yaml` if the repository contains the whole workspace).
3. Set `DATABASE_URL` to the Neon connection string in Render. The Blueprint generates a `SESSION_SECRET` and sets production TLS settings.
4. Render assigns a free `*.onrender.com` hostname after deployment. The service serves both pages and `/api` from the same origin.

Render's free web service sleeps after inactivity and can take about a minute to wake. Free service filesystems are ephemeral, so the database must remain on Neon. Render describes free services as suitable for hobby/testing, not production workloads. A free provider subdomain is included; a custom domain generally needs a domain you already own.

## Important limits

The checkout records an order but does not charge a card. No payment-card data is collected. Social sign-in, email delivery, shipping labels, inventory management, and fulfillment integrations still need provider accounts and configuration. Product photography and Bootstrap/font assets load from external CDNs.