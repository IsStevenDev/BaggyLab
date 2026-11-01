import { showView } from "./dialogs.js";
import { validateForm, watchFields, resetForm, contactRules } from "./forms.js";

const SENDING_MS = 900;

/* Los elementos se buscan al iniciar y no al importar el módulo: si falta
   alguno en el HTML solo Contacto deja de funcionar, no toda la página */
export function initContact() {
  const dialog = document.getElementById("dialog-contacto");
  const form = document.getElementById("form-contact");

  if (!dialog || !form) {
    console.warn(
      "Contacto: faltan #dialog-contacto o #form-contact en el HTML",
    );
    return;
  }

  const submit = form.querySelector('[type="submit"]');

  function handleSubmit(event) {
    event.preventDefault();
    if (submit.disabled) return;
    if (!validateForm(form, contactRules)) return;

    const data = new FormData(form);
    const nombre = String(data.get("nombre")).trim();
    const correo = String(data.get("correo")).trim();

    submit.disabled = true;
    submit.textContent = "Enviando...";

    setTimeout(() => {
      dialog.querySelector('[data-sent="nombre"]').textContent = nombre;
      dialog.querySelector('[data-sent="correo"]').textContent = correo;

      showView(dialog, "sent");
      dialog.querySelector('[data-view="sent"] .confirm__title').focus();

      resetForm(form);
      submit.disabled = false;
      submit.textContent = "Enviar mensaje";
    }, SENDING_MS);
  }

  form.addEventListener("submit", handleSubmit);
  watchFields(form, contactRules);
}
