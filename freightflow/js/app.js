document.addEventListener("DOMContentLoaded", () => {

  const shell = document.querySelector(".app-shell");
  const sidebarToggle = document.querySelector("[data-action='toggle-sidebar']");
  const mobileNavToggle = document.querySelector("[data-action='toggle-mobile-nav']");
  const profileTrigger = document.querySelector("[data-action='toggle-profile-menu']");

  if (sidebarToggle && shell) {
    sidebarToggle.addEventListener("click", () => {
      const isCompact = shell.getAttribute("data-sidebar") === "compact";
      FreightFlowTheme.set({
        sidebar: isCompact ? "expanded" : "compact"
      });
    });
  }

  if (mobileNavToggle && shell) {
    mobileNavToggle.addEventListener("click", () => {
      const isOpen = shell.getAttribute("data-sidebar-mobile") === "open";
      shell.setAttribute(
        "data-sidebar-mobile",
        isOpen ? "closed" : "open"
      );
    });
  }

  const dropdown = document.getElementById("profileDropdown");

  if (profileTrigger && dropdown) {

    profileTrigger.addEventListener("click",(e)=>{

      e.stopPropagation();

      dropdown.classList.toggle("show");

    });

    document.addEventListener("click",()=>{

      dropdown.classList.remove("show");

    });

  }

  const current = location.pathname.split("/").pop() || "dashboard.html";

  document.querySelectorAll(".nav__item").forEach((item) => {

    if(item.getAttribute("href")===current){

      item.classList.add("is-active");

    }

  });

});