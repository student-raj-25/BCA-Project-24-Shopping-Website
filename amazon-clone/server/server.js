require("dotenv").config();

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const bcrypt = require("bcryptjs");
const connectPgSimple = require("connect-pg-simple");
const express = require("express");
const { rateLimit } = require("express-rate-limit");
const session = require("express-session");
const helmet = require("helmet");
const { Pool } = require("pg");
const catalog = require("../js/catalog-data");

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const databaseUrl = process.env.DATABASE_URL;
const sessionSecret = process.env.SESSION_SECRET;
const port = Number(process.env.PORT || 3000);
const projectRoot = path.resolve(__dirname, "..");

if (!databaseUrl) throw new Error("DATABASE_URL is required. Copy .env.example to .env and configure PostgreSQL.");
if (!sessionSecret || sessionSecret.length < 32) throw new Error("SESSION_SECRET must contain at least 32 characters.");

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: true },
  max: Number(process.env.PG_POOL_MAX || (isProduction ? 3 : 10)),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

const PgSessionStore = connectPgSimple(session);
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 12, standardHeaders: "draft-7", legacyHeaders: false });
const messageLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 12, standardHeaders: "draft-7", legacyHeaders: false });

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net", "data:"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
      upgradeInsecureRequests: isProduction ? [] : null
    }
  }
}));
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));
app.use(session({
  name: "northstar.sid",
  store: new PgSessionStore({ pool, tableName: "user_sessions", createTableIfMissing: true }),
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));
app.use("/api", (request, response, next) => {
  request.session.guest = true;
  next();
});

app.use("/api", (request, response, next) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method) && request.get("origin")) {
    try {
      if (new URL(request.get("origin")).origin !== `${request.protocol}://${request.get("host")}`) {
        return response.status(403).json({ error: "Cross-origin request denied." });
      }
    } catch {
      return response.status(403).json({ error: "Invalid request origin." });
    }
  }
  next();
});

function cleanText(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

function currentOwner(request) {
  return request.session.userId ? `user:${request.session.userId}` : `guest:${request.sessionID}`;
}

function requireFields(response, fields) {
  const missing = fields.some(value => !value);
  if (missing) response.status(400).json({ error: "Please complete all required fields." });
  return !missing;
}

function publicUser(row) {
  return { id: row.id, name: row.name, email: row.email, phone: row.phone };
}

function rotateSession(request) {
  return new Promise((resolve, reject) => request.session.regenerate(error => error ? reject(error) : resolve()));
}

function saveSession(request) {
  return new Promise((resolve, reject) => request.session.save(error => error ? reject(error) : resolve()));
}

async function mergeGuestData(client, guestOwner, userOwner) {
  await client.query(
    `INSERT INTO cart_items (owner_key, product_id, quantity)
     SELECT $2, product_id, quantity FROM cart_items WHERE owner_key = $1
     ON CONFLICT (owner_key, product_id) DO UPDATE SET quantity = LEAST(cart_items.quantity + EXCLUDED.quantity, 99)`,
    [guestOwner, userOwner]
  );
  await client.query("DELETE FROM cart_items WHERE owner_key = $1", [guestOwner]);
  await client.query(
    `INSERT INTO wishlist_items (owner_key, product_id)
     SELECT $2, product_id FROM wishlist_items WHERE owner_key = $1
     ON CONFLICT (owner_key, product_id) DO NOTHING`,
    [guestOwner, userOwner]
  );
  await client.query("DELETE FROM wishlist_items WHERE owner_key = $1", [guestOwner]);
}

app.get("/api/health", async (request, response, next) => {
  try {
    await pool.query("SELECT 1");
    response.json({ status: "ok", database: "connected" });
  } catch (error) {
    next(error);
  }
});

app.get("/api/products", async (request, response, next) => {
  try {
    const result = await pool.query(
      `SELECT id, title, category, price, old_price AS "oldPrice", rating, reviews, tag,
              image, created, description FROM products ORDER BY created DESC, title`
    );
    response.json({ products: result.rows.map(row => ({ ...row, price: Number(row.price), oldPrice: Number(row.oldPrice), rating: Number(row.rating) })) });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/signup", authLimiter, async (request, response, next) => {
  const name = cleanText(request.body.name, 80);
  const email = cleanText(request.body.email, 254).toLowerCase();
  const phone = cleanText(request.body.phone, 24);
  const password = typeof request.body.password === "string" ? request.body.password : "";
  if (!requireFields(response, [name, email, password])) return;
  if (!isValidEmail(email) || password.length < 8 || password.length > 100 || (phone && !/^[0-9]{8,15}$/.test(phone))) {
    return response.status(400).json({ error: "Check your details and try again." });
  }
  try {
    const hash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      "INSERT INTO users (name, email, phone, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone",
      [name, email, phone, hash]
    );
    const previousGuest = `guest:${request.sessionID}`;
    const user = result.rows[0];
    await rotateSession(request);
    request.session.userId = user.id;
    request.session.userEmail = user.email;
    await saveSession(request);
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await mergeGuestData(client, previousGuest, `user:${user.id}`);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
    response.status(201).json({ user: publicUser(user) });
  } catch (error) {
    if (error.code === "23505") return response.status(409).json({ error: "An account with that email already exists." });
    next(error);
  }
});

app.post("/api/auth/login", authLimiter, async (request, response, next) => {
  const email = cleanText(request.body.email, 254).toLowerCase();
  const password = typeof request.body.password === "string" ? request.body.password : "";
  if (!requireFields(response, [email, password])) return;
  try {
    const result = await pool.query("SELECT id, name, email, phone, password_hash FROM users WHERE LOWER(email) = $1", [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return response.status(401).json({ error: "Email or password is incorrect." });
    }
    const previousGuest = `guest:${request.sessionID}`;
    await rotateSession(request);
    request.session.userId = user.id;
    request.session.userEmail = user.email;
    await saveSession(request);
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await mergeGuestData(client, previousGuest, `user:${user.id}`);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
    response.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

app.get("/api/auth/me", async (request, response, next) => {
  if (!request.session.userId) return response.json({ user: null });
  try {
    const result = await pool.query("SELECT id, name, email, phone FROM users WHERE id = $1", [request.session.userId]);
    response.json({ user: result.rows[0] ? publicUser(result.rows[0]) : null });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/logout", async (request, response, next) => {
  request.session.destroy(error => {
    if (error) return next(error);
    response.clearCookie("northstar.sid", { httpOnly: true, sameSite: "lax", secure: isProduction });
    response.status(204).end();
  });
});

app.get("/api/cart", async (request, response, next) => {
  try {
    const result = await pool.query("SELECT product_id AS id, quantity FROM cart_items WHERE owner_key = $1 ORDER BY updated_at", [currentOwner(request)]);
    response.json({ items: result.rows });
  } catch (error) {
    next(error);
  }
});

app.post("/api/cart/items", async (request, response, next) => {
  const productId = cleanText(request.body.productId, 100);
  const quantity = Number(request.body.quantity || 1);
  if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) return response.status(400).json({ error: "Invalid product or quantity." });
  try {
    const result = await pool.query(
      `INSERT INTO cart_items (owner_key, product_id, quantity) VALUES ($1, $2, $3)
       ON CONFLICT (owner_key, product_id) DO UPDATE
       SET quantity = LEAST(cart_items.quantity + EXCLUDED.quantity, 99), updated_at = NOW()
       RETURNING product_id AS id, quantity`,
      [currentOwner(request), productId, quantity]
    );
    response.status(201).json({ item: result.rows[0] });
  } catch (error) {
    if (error.code === "23503") return response.status(404).json({ error: "Product not found." });
    next(error);
  }
});

app.patch("/api/cart/items/:productId", async (request, response, next) => {
  const quantity = Number(request.body.quantity);
  if (!Number.isInteger(quantity) || quantity < 0 || quantity > 99) return response.status(400).json({ error: "Quantity must be between 0 and 99." });
  try {
    if (quantity === 0) {
      await pool.query("DELETE FROM cart_items WHERE owner_key = $1 AND product_id = $2", [currentOwner(request), request.params.productId]);
      return response.status(204).end();
    }
    const result = await pool.query(
      "UPDATE cart_items SET quantity = $3, updated_at = NOW() WHERE owner_key = $1 AND product_id = $2 RETURNING product_id AS id, quantity",
      [currentOwner(request), request.params.productId, quantity]
    );
    if (!result.rowCount) return response.status(404).json({ error: "Cart item not found." });
    response.json({ item: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/cart/items/:productId", async (request, response, next) => {
  try {
    await pool.query("DELETE FROM cart_items WHERE owner_key = $1 AND product_id = $2", [currentOwner(request), request.params.productId]);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.get("/api/wishlist", async (request, response, next) => {
  try {
    const result = await pool.query("SELECT product_id AS id FROM wishlist_items WHERE owner_key = $1 ORDER BY created_at DESC", [currentOwner(request)]);
    response.json({ items: result.rows.map(row => row.id) });
  } catch (error) {
    next(error);
  }
});

app.post("/api/wishlist/items", async (request, response, next) => {
  const productId = cleanText(request.body.productId, 100);
  if (!productId) return response.status(400).json({ error: "Product is required." });
  try {
    await pool.query("INSERT INTO wishlist_items (owner_key, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [currentOwner(request), productId]);
    response.status(204).end();
  } catch (error) {
    if (error.code === "23503") return response.status(404).json({ error: "Product not found." });
    next(error);
  }
});

app.delete("/api/wishlist/items/:productId", async (request, response, next) => {
  try {
    await pool.query("DELETE FROM wishlist_items WHERE owner_key = $1 AND product_id = $2", [currentOwner(request), request.params.productId]);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.post("/api/orders", async (request, response, next) => {
  const name = cleanText(request.body.name, 80);
  const phone = cleanText(request.body.phone, 24);
  const address = cleanText(request.body.address, 200);
  const city = cleanText(request.body.city, 100);
  const state = cleanText(request.body.state, 100);
  const postal = cleanText(request.body.postal, 10);
  const paymentMethod = cleanText(request.body.payment, 12);
  if (!requireFields(response, [name, phone, address, city, state, postal, paymentMethod])) return;
  if (!/^[0-9]{8,15}$/.test(phone) || !/^[0-9]{6}$/.test(postal) || !["card", "upi", "cod"].includes(paymentMethod)) {
    return response.status(400).json({ error: "Check your delivery or payment details." });
  }
  const client = await pool.connect();
  try {
    const ownerKey = currentOwner(request);
    await client.query("BEGIN");
    const basket = await client.query(
      `SELECT ci.product_id, ci.quantity, p.title, p.price FROM cart_items ci
       JOIN products p ON p.id = ci.product_id WHERE ci.owner_key = $1 FOR UPDATE OF ci`,
      [ownerKey]
    );
    if (!basket.rowCount) {
      await client.query("ROLLBACK");
      return response.status(400).json({ error: "Your basket is empty." });
    }
    const subtotal = basket.rows.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    const delivery = subtotal === 0 || subtotal >= 2000 ? 0 : 99;
    const orderId = `NS-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    const order = await client.query(
      `INSERT INTO orders (id, owner_key, user_id, subtotal, delivery, total, customer_name, customer_email,
       customer_phone, address, city, state, postal_code, payment_method)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       RETURNING id, total, created_at AS date, status`,
      [orderId, ownerKey, request.session.userId || null, subtotal, delivery, subtotal + delivery, name,
        request.session.userEmail || "", phone, address, city, state, postal, paymentMethod]
    );
    for (const item of basket.rows) {
      await client.query(
        "INSERT INTO order_items (order_id, product_id, title, unit_price, quantity) VALUES ($1,$2,$3,$4,$5)",
        [orderId, item.product_id, item.title, item.price, item.quantity]
      );
    }
    await client.query("DELETE FROM cart_items WHERE owner_key = $1", [ownerKey]);
    await client.query("COMMIT");
    response.status(201).json({ order: order.rows[0] });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
});

app.get("/api/orders", async (request, response, next) => {
  try {
    const result = await pool.query(
      `SELECT id, total, created_at AS date, status FROM orders WHERE owner_key = $1 ORDER BY created_at DESC LIMIT 20`,
      [currentOwner(request)]
    );
    response.json({ orders: result.rows.map(order => ({ ...order, total: Number(order.total) })) });
  } catch (error) {
    next(error);
  }
});

app.post("/api/newsletter", messageLimiter, async (request, response, next) => {
  const email = cleanText(request.body.email, 254).toLowerCase();
  if (!isValidEmail(email)) return response.status(400).json({ error: "Enter a valid email address." });
  try {
    await pool.query("INSERT INTO newsletter_subscribers (email) VALUES ($1) ON CONFLICT DO NOTHING", [email]);
    response.status(201).json({ subscribed: true });
  } catch (error) {
    next(error);
  }
});

app.post("/api/contact", messageLimiter, async (request, response, next) => {
  const name = cleanText(request.body.name, 80);
  const email = cleanText(request.body.email, 254).toLowerCase();
  const topic = cleanText(request.body.topic, 80);
  const message = cleanText(request.body.message, 3000);
  if (!requireFields(response, [name, email, topic, message])) return;
  if (!isValidEmail(email) || message.length < 10) return response.status(400).json({ error: "Check your contact details and message." });
  try {
    await pool.query("INSERT INTO contact_messages (name, email, topic, message) VALUES ($1,$2,$3,$4)", [name, email, topic, message]);
    response.status(201).json({ received: true });
  } catch (error) {
    next(error);
  }
});

app.use("/api", (request, response) => response.status(404).json({ error: "API endpoint not found." }));
app.use(express.static(projectRoot, { extensions: ["html"], maxAge: isProduction ? "1h" : 0 }));
app.use((request, response) => response.status(404).sendFile(path.join(projectRoot, "404.html")));
app.use((error, request, response, next) => {
  if (response.headersSent) return next(error);
  console.error("Request failed:", error.message);
  response.status(500).json({ error: "Something went wrong. Please try again." });
});

async function initializeDatabase() {
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  await pool.query(schema);
  for (const product of catalog) {
    await pool.query(
      `INSERT INTO products (id, title, category, price, old_price, rating, reviews, tag, image, created, description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, category=EXCLUDED.category, price=EXCLUDED.price,
       old_price=EXCLUDED.old_price, rating=EXCLUDED.rating, reviews=EXCLUDED.reviews, tag=EXCLUDED.tag,
       image=EXCLUDED.image, created=EXCLUDED.created, description=EXCLUDED.description`,
      [product.id, product.title, product.category, product.price, product.oldPrice, product.rating, product.reviews,
        product.tag, product.image, product.created, product.description]
    );
  }
}

const databaseReady = initializeDatabase();

if (require.main === module) {
  databaseReady.then(() => {
    app.listen(port, () => console.log(`Northstar Market listening on http://localhost:${port}`));
  }).catch(error => {
    console.error("Database startup failed:", error.message);
    process.exitCode = 1;
  });
}

module.exports = { app, databaseReady, pool };