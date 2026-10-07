(function () {
  const USER_KEY = "northstarUser";

  function currentUser() {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || "null"); }
    catch { return null; }
  }

  function saveUser(user) { localStorage.setItem(USER_KEY, JSON.stringify(user)); }

  async function syncCurrentUser() {
    try {
      const response = await window.NorthstarApi.request("/auth/me");
      const previous = currentUser();
      if (response.user) saveUser(response.user);
      else localStorage.removeItem(USER_KEY);
      if (JSON.stringify(previous) !== JSON.stringify(response.user) && document.body.dataset.page === "profile") {
        window.ShopPages.refreshCurrent();
      }
      return response.user;
    } catch {
      return currentUser();
    }
  }

  async function authenticate(path, payload, fallback) {
    try {
      const response = await window.NorthstarApi.request(path, { method: "POST", body: JSON.stringify(payload) });
      saveUser(response.user);
      window.location.href = "profile.html";
    } catch (error) {
      if (!window.NorthstarApi.isUnavailable(error)) {
        window.Northstar.showToast("Could not sign in", error.message);
        return;
      }
      fallback();
    }
  }

  function init() {
    const login = document.getElementById("login-form");
    const signup = document.getElementById("signup-form");
    if (login) {
      login.addEventListener("submit", event => {
        event.preventDefault();
        event.currentTarget.classList.add("was-validated");
        if (!event.currentTarget.checkValidity()) return;
        const values = new FormData(event.currentTarget);
        const payload = { email: values.get("email"), password: values.get("password") };
        authenticate("/auth/login", payload, () => {
          const user = { name: String(values.get("email")).split("@")[0], email: values.get("email") };
          saveUser(user);
          window.Northstar.showToast("Demo sign-in", `Welcome back, ${user.name}.`);
          window.location.href = "profile.html";
        });
      });
    }
    if (signup) {
      const password = signup.elements.password;
      const confirmation = signup.elements.confirmPassword;
      confirmation.addEventListener("input", () => {
        confirmation.setCustomValidity(confirmation.value && confirmation.value !== password.value ? "Passwords do not match" : "");
      });
      password.addEventListener("input", () => {
        confirmation.setCustomValidity(confirmation.value && confirmation.value !== password.value ? "Passwords do not match" : "");
      });
      signup.addEventListener("submit", event => {
        event.preventDefault();
        event.currentTarget.classList.add("was-validated");
        if (!event.currentTarget.checkValidity()) return;
        const values = new FormData(event.currentTarget);
        const payload = { name: values.get("fullName"), email: values.get("email"), phone: values.get("phone"), password: values.get("password") };
        authenticate("/auth/signup", payload, () => {
          const user = { name: payload.name, email: payload.email, phone: payload.phone };
          saveUser(user);
          window.Northstar.showToast("Demo account created", `Welcome to Northstar, ${user.name}.`);
          window.location.href = "profile.html";
        });
      });
    }
    document.querySelectorAll("[data-social-login]").forEach(button => button.addEventListener("click", () => {
      window.Northstar.showToast("Demo sign-in", "Social sign-in needs a configured provider.");
    }));
    document.querySelector("[data-forgot-password]")?.addEventListener("click", event => {
      event.preventDefault();
      window.Northstar.showToast("Password help", "Password recovery is not connected in this front-end demo.");
    });
  }

  window.ShopAuth = { currentUser, saveUser, init, syncCurrentUser };
})();