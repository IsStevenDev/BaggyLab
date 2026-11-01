/* Cada diálogo puede tener varias vistas (<section data-view="...">) y solo
   una visible a la vez: el carrito pasa de lista a formulario a confirmación */
export function showView(dialog, name) {
  for (const view of dialog.querySelectorAll("[data-view]")) {
    view.hidden = view.dataset.view !== name;
  }
  dialog.scrollTop = 0;
}

export function openDialog(name) {
  const dialog = document.getElementById(`dialog-${name}`);
  if (!dialog) return null;

  for (const other of document.querySelectorAll("dialog[open]")) {
    if (other !== dialog) other.close();
  }

  /* Siempre se abre en la primera vista, no donde se quedó la vez anterior */
  const firstView = dialog.querySelector("[data-view]");
  if (firstView) showView(dialog, firstView.dataset.view);

  if (!dialog.open) dialog.showModal();
  return dialog;
}

export function initDialogs() {
  for (const dialog of document.querySelectorAll("dialog.dialog")) {
    /* Si se pulsa dentro del panel y se suelta fuera (al seleccionar texto),
       el clic se atribuye al diálogo. Por eso se exige que la pulsación
       también haya empezado en el fondo */
    let pressedOnBackdrop = false;

    dialog.addEventListener("pointerdown", (event) => {
      pressedOnBackdrop = event.target === dialog;
    });

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog && pressedOnBackdrop) dialog.close();
    });
  }
}
