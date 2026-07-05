/*
  Purpose: Thin fetch wrapper for talking to the FreightFlow REST API.
           Redirects to login if a request comes back unauthenticated.
  Author: FreightFlow Engineering
  Version: 0.1.0
  Last Updated: 2026-07-05
*/

const FreightFlowAPI = (() => {
  async function request(path, options = {}) {
    const res = await fetch(`/api${path}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      ...options
    });

    if (res.status === 401 && !path.startsWith("/auth")) {
      window.location.href = "index.html";
      return null;
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || "Something went wrong. Please try again.");
    }

    return data;
  }

  const get = (path) => request(path);
  const post = (path, body) =>
    request(path, {
      method: "POST",
      body: JSON.stringify(body)
    });

  const put = (path, body) =>
    request(path, {
      method: "PUT",
      body: JSON.stringify(body)
    });

  const del = (path) =>
    request(path, {
      method: "DELETE"
    });

  return { get, post, put, del };
})();