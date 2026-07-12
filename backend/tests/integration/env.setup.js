// Registered via jest "setupFiles" so .env is loaded before any test file's
// own requires. Needed because server.js is required directly here (unlike
// src/index.js, which always calls dotenv.config() before touching server.js),
// and some controllers read process.env.DATABASE_URL as a require-time side
// effect (constructing the pg Pool) before authController.js's own dotenv call.
require('dotenv').config();
