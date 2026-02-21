(function () {
  const $ = (sel, root = document) => root.querySelector(sel);

  function headerContainer() {
    // En Material suele existir esto:
    return $(".md-header__inner") || $(".md-header");
  }

  function ensureButton(id, title, svgPathD, onClick) {
    const header = headerContainer();
    if (!header) return null;

    // Evitar duplicados
    let btn = document.getElementById(id);
    if (btn) return btn;

    btn = document.createElement("button");
    btn.id = id;
    btn.type = "button";
    btn.className = "course-header-btn";
    btn.title = title;
    btn.setAttribute("aria-label", title);

    btn.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="${svgPathD}"></path>
      </svg>
    `;

    btn.addEventListener("click", onClick);

    // Intenta ponerlos cerca del buscador si existe
    const search = $(".md-search", header) || $(".md-header__option", header);
    if (search && search.parentElement) {
      search.parentElement.appendChild(btn);
    } else {
      header.appendChild(btn);
    }

    return btn;
  }

  function setSidebarCollapsed(collapsed) {
    document.body.classList.toggle("sidebar-collapsed", collapsed);
    try {
      localStorage.setItem("sidebar-collapsed", collapsed ? "1" : "0");
    } catch {}
  }

  function toggleSidebar() {
    setSidebarCollapsed(!document.body.classList.contains("sidebar-collapsed"));
  }

  function restoreSidebarState() {
    try {
      const v = localStorage.getItem("sidebar-collapsed");
      if (v === "1") document.body.classList.add("sidebar-collapsed");
    } catch {}
  }

  function clearSearchHighlights() {
    // 1) Quitar parámetro ?h=... si existe
    const url = new URL(window.location.href);
    if (url.searchParams.has("h")) {
      url.searchParams.delete("h");
      window.history.replaceState({}, "", url.toString());
    }

    // 2) Vaciar el input del buscador si existe
    const input = $(".md-search__input");
    if (input) input.value = "";

    // 3) Eliminar todos los <mark> del documento (lo que ves “amarillo”)
    const marks = document.querySelectorAll("mark");
    marks.forEach((m) => {
      const parent = m.parentNode;
      parent.replaceChild(document.createTextNode(m.textContent), m);
      parent.normalize();
    });
  }

  function injectButtons() {
    restoreSidebarState();

    // Botón hamburguesa (☰)
    ensureButton(
      "toggle-sidebar-btn",
      "Mostrar/ocultar menú",
      "M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z",
      toggleSidebar
    );

    // Botón clear highlight (✕)
    ensureButton(
      "clear-search-highlight-btn",
      "Borrar resaltado de búsqueda",
      "M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.3 19.71 2.89 18.29 9.17 12 2.89 5.71 4.3 4.29l6.29 6.3 6.3-6.3z",
      clearSearchHighlights
    );
  }

  // Carga normal
  document.addEventListener("DOMContentLoaded", injectButtons);

  // Si algún día activas navigation.instant, Material emite este evento:
  document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("navigation:loaded", injectButtons);
  });

  // Fallback: reintenta un poco (por si el header tarda)
  let tries = 0;
  const t = setInterval(() => {
    tries += 1;
    injectButtons();
    if (document.getElementById("toggle-sidebar-btn") || tries > 20) clearInterval(t);
  }, 250);
})();
