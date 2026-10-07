const serverless = require("serverless-http");
const { app, databaseReady } = require("../../server/server");

const expressHandler = serverless(app);
const functionPrefix = "/.netlify/functions/api";

exports.handler = async (event, context) => {
  await databaseReady;
  const requestPath = event.path || "/";
  if (requestPath.startsWith(functionPrefix)) {
    event.path = requestPath.slice(functionPrefix.length) || "/";
  }
  return expressHandler(event, context);
};