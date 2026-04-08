'use strict';

// Vercel serverless entry point for the NestJS backend.
// The backend is pre-compiled by `nest build` during Vercel's build step.
// We import the compiled factory from dist/ and cache the app instance so it is
// reused across warm invocations (avoids cold-start DB reconnects on every request).

const express = require('express');
const { ExpressAdapter } = require('@nestjs/platform-express');

let cachedApp = null;

async function getApp() {
  if (cachedApp) return cachedApp;

  // Dynamically require compiled output so this file stays plain CommonJS and
  // avoids the emitDecoratorMetadata incompatibility with @vercel/node's esbuild.
  const { createApp } = require('../apps/backend/dist/app.factory');

  const server = express();
  const adapter = new ExpressAdapter(server);
  const app = await createApp(adapter);

  await app.init();

  cachedApp = server;
  return cachedApp;
}

module.exports = async (req, res) => {
  const app = await getApp();
  app(req, res);
};
