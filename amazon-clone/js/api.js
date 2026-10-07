(function () {
  const projectPath = new URL("../", document.currentScript.src).pathname;
  const staticPreview = location.protocol === "file:" || projectPath !== "/";
  const available = staticPreview ? Promise.resolve(false) : fetch("/api/health", { headers: { Accept: "application/json" }, credentials: "same-origin" })
    .then(async response => {
      if (!response.ok) return false;
      const health = await response.json().catch(() => null);
      return health?.status === "ok" && health?.database === "connected";
    })
    .catch(() => false);

  async function request(path, options = {}) {
    if (!(await available)) {
      const error = new Error("The backend is not available.");
      error.status = 501;
      throw error;
    }
    const headers = { Accept: "application/json", ...(options.headers || {}) };
    if (options.body) headers["Content-Type"] = "application/json";
    const response = await fetch(`/api${path}`, { ...options, headers, credentials: "same-origin" });
    const payload = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) {
      const error = new Error(payload?.error || "The request could not be completed.");
      error.status = response.status;
      throw error;
    }
    return payload;
  }

  function isUnavailable(error) {
    return !error?.status || [404, 405, 501].includes(error.status);
  }

  window.NorthstarApi = { request, isUnavailable };
})();