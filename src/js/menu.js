const toggle = document.getElementById("menu-toggle");
const panel = document.querySelector(".menu-panel");
const desktop = window.matchMedia("(min-width: 1024px)");

export function closeMenu() {
  if (toggle.checked) toggle.checked = false;
}

export function initMenu() {
  /* Cualquier enlace o botón del panel cierra el menú. El label de cerrar
     no entra aquí porque ya desmarca el checkbox por su cuenta */
  panel.addEventListener("click", (event) => {
    if (event.target.closest("a, button")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.checked) {
      closeMenu();
      toggle.focus();
    }
  });

  /* Si se gira la pantalla o se agranda la ventana con el menú abierto, el
     panel desaparece pero el bloqueo de scroll quedaría activo */
  desktop.addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });
}
