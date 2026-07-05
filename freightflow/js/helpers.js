/*
  Purpose: Shared, reusable helpers used across pages (toasts, validation, formatting)
  Author: FreightFlow Engineering
  Version: 0.1.0
  Last Updated: 2026-07-04
*/

const FreightFlowHelpers = (() => {
  function ensureToastRegion() {
    let region = document.querySelector(".toast-region");
    if (!region) {
      region = document.createElement("div");
      region.className = "toast-region";
      region.setAttribute("aria-live", "polite");
      document.body.appendChild(region);
    }
    return region;
  }

  const ICONS = {
    success: "M20 6L9 17l-5-5",
    warning: "M12 9v4m0 4h.01M10.29 3.86l-8.18 14A2 2 0 0 0 3.82 21h16.36a2 2 0 0 0 1.71-3.14l-8.18-14a2 2 0 0 0-3.42 0z",
    danger: "M12 8v4m0 4h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z",
    info: "M12 16v-4m0-4h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"
  };

  function toast(message, { type = "info", duration = 4000 } = {}) {
    const region = ensureToastRegion();
    const el = document.createElement("div");
    el.className = `toast toast--${type}`;
    el.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="${ICONS[type] || ICONS.info}"></path>
      </svg>
      <span>${message}</span>
    `;
    region.appendChild(el);

    const remove = () => {
      el.classList.add("is-leaving");
      setTimeout(() => el.remove(), 220);
    };
    setTimeout(remove, duration);
    el.addEventListener("click", remove);
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function setFieldError(fieldEl, message) {
    fieldEl.classList.add("is-invalid");
    const errorEl = fieldEl.querySelector(".field__error");
    if (errorEl) errorEl.textContent = message;
  }

  function clearFieldError(fieldEl) {
    fieldEl.classList.remove("is-invalid");
  }

  function formatCurrency(value, currency = "USD") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
  }

  function debounce(fn, wait = 250) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  return { toast, validateEmail, setFieldError, clearFieldError, formatCurrency, debounce };
})();
