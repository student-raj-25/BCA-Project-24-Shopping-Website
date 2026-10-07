const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const output = path.join(root, "dist");

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (entry.isFile() && entry.name.endsWith(".html")) {
    fs.copyFileSync(path.join(root, entry.name), path.join(output, entry.name));
  }
  if (entry.isFile() && ["_redirects", "api-offline.json"].includes(entry.name)) {
    fs.copyFileSync(path.join(root, entry.name), path.join(output, entry.name));
  }
  if (entry.isDirectory() && ["css", "js", "assets"].includes(entry.name)) {
    fs.cpSync(path.join(root, entry.name), path.join(output, entry.name), { recursive: true });
  }
}

console.log(`Built static storefront in ${output}`);