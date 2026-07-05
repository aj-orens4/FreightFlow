/*
  Purpose: Initializes dashboard charts (Chart.js) and the live fleet map (Leaflet)
  Author: FreightFlow Engineering
  Version: 0.1.0
  Last Updated: 2026-07-04
*/

document.addEventListener("DOMContentLoaded", () => {
  updateGreeting();
  loadDashboardHeader();
  
  initRevenueChart();
  initShipmentStatusChart();
  initMap();
  animateCounters();
});

function chartColors() {
  const dark = document.documentElement.getAttribute("data-theme") === "dark";
  return {
    grid: dark ? "rgba(248,250,252,0.08)" : "rgba(15,23,42,0.06)",
    text: dark ? "#94A3B8" : "#64748B"
  };
}

function initRevenueChart() {
  const ctx = document.getElementById("revenueChart");
  if (!ctx || typeof Chart === "undefined") return;
  const c = chartColors();

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [{
        label: "Revenue",
        data: [182000, 194500, 176300, 205800, 221400, 238900],
        borderColor: "#2563EB",
        backgroundColor: "rgba(37,99,235,0.12)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: c.text } },
        y: { grid: { color: c.grid }, ticks: { color: c.text, callback: (v) => "$" + v / 1000 + "k" } }
      }
    }
  });
}

function initShipmentStatusChart() {
  const ctx = document.getElementById("shipmentStatusChart");
  if (!ctx || typeof Chart === "undefined") return;

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Delivered", "In Transit", "Pending", "Delayed"],
      datasets: [{
        data: [64, 21, 9, 6],
        backgroundColor: ["#22C55E", "#2563EB", "#F59E0B", "#EF4444"],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "72%",
      plugins: { legend: { display: false } }
    }
  });
}

function initMap() {
  const el = document.getElementById("fleetMap");
  if (!el || typeof L === "undefined") return;

  const map = L.map(el, { zoomControl: false, attributionControl: false }).setView([14.6091, 121.0223], 11);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18
  }).addTo(map);

  const vehicles = [
    { name: "Truck 04 — Manila Loop", lat: 14.5995, lng: 120.9842, status: "On route" },
    { name: "Truck 11 — QC Depot", lat: 14.6760, lng: 121.0437, status: "Loading" },
    { name: "Van 02 — Makati Express", lat: 14.5547, lng: 121.0244, status: "On route" },
  ];

  vehicles.forEach((v) => {
    const marker = L.circleMarker([v.lat, v.lng], {
      radius: 8,
      color: "#2563EB",
      fillColor: "#2563EB",
      fillOpacity: 0.9,
      weight: 2
    }).addTo(map);
    marker.bindPopup(`<strong>${v.name}</strong><br>${v.status}`);
  });
}

function animateCounters() {
  document.querySelectorAll("[data-counter]").forEach((el) => {
    const target = parseFloat(el.dataset.counter);
    const isDecimal = target % 1 !== 0;
    const duration = 900;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = isDecimal ? value.toFixed(1) : Math.round(value).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

async function loadDashboardHeader() {
  try {
    const { user } = await FreightFlowAPI.get("/auth/me");

    const greeting = document.getElementById("dashboardGreeting");
    const date = document.getElementById("dashboardDate");

    const hour = new Date().getHours();

    let message = "Good Evening";

    if (hour < 12)
      message = "Good Morning";
    else if (hour < 18)
      message = "Good Afternoon";

    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    greeting.textContent = `${message}, ${user.fullName}!`;

    date.textContent =
      `Here's what's happening across your fleet today — ${today}`;

  } catch (err) {
    console.error(err);
  }
}

function updateGreeting() {

    const greeting = document.getElementById("dashboardGreeting");
    const date = document.getElementById("dashboardDate");

    if (!greeting || !date) return;

    const hour = new Date().getHours();

    let message = "Good Evening";

    if (hour < 12)
        message = "Good Morning";
    else if (hour < 18)
        message = "Good Afternoon";

    const today = new Date();

    const formattedDate = today.toLocaleDateString("en-PH", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    });

    const time = today.toLocaleTimeString("en-PH", {
        hour: "numeric",
        minute: "2-digit"
    });

    const profileName =
        document.getElementById("profileName")?.textContent || "User";

    greeting.textContent = `${message}, ${profileName}`;

    date.textContent =
        `Here's what's happening across your fleet today — ${formattedDate} • ${time}`;

}