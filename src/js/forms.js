const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^3\d{9}$/;

/* Cada regla recibe el valor ya recortado y devuelve el mensaje de error,
   o una cadena vacía si el campo es válido */
export const checkoutRules = {
  nombre: (value) =>
    /\S+\s+\S+/.test(value) ? "" : "Escribe tu nombre y apellido.",
  telefono: (value) =>
    PHONE.test(value.replace(/\s/g, ""))
      ? ""
      : "Ingresa un celular de 10 dígitos que empiece por 3.",
  ciudad: (value) => (value.length >= 2 ? "" : "Escribe tu ciudad."),
  direccion: (value) =>
    value.length >= 6 ? "" : "Escribe tu dirección completa.",
};

export const contactRules = {
  nombre: (value) => (value.length >= 2 ? "" : "Escribe tu nombre."),
  correo: (value) =>
    EMAIL.test(value)
      ? ""
      : "Ingresa un correo válido, por ejemplo nombre@correo.com.",
  mensaje: (value) =>
    value.length >= 10 ? "" : "Cuéntanos un poco más (mínimo 10 caracteres).",
};

function setFieldError(form, field, message) {
  const error = form.querySelector(`[data-error-for="${field.name}"]`);
  error.textContent = message;
  error.hidden = message === "";
  field.setAttribute("aria-invalid", String(message !== ""));
}

export function validateForm(form, rules) {
  let firstInvalid = null;

  for (const [name, rule] of Object.entries(rules)) {
    const field = form.elements[name];
    const message = rule(field.value.trim());
    setFieldError(form, field, message);
    if (message && !firstInvalid) firstInvalid = field;
  }

  if (firstInvalid) firstInvalid.focus();
  return firstInvalid === null;
}

/* Una vez que un campo se marcó como inválido, se revalida mientras se
   escribe para que el error desaparezca apenas queda corregido */
export function watchFields(form, rules) {
  form.addEventListener("input", (event) => {
    const field = event.target;
    const rule = rules[field.name];
    if (!rule || field.getAttribute("aria-invalid") !== "true") return;
    setFieldError(form, field, rule(field.value.trim()));
  });
}

export function resetForm(form) {
  form.reset();

  for (const error of form.querySelectorAll("[data-error-for]")) {
    error.textContent = "";
    error.hidden = true;
  }
  for (const field of form.querySelectorAll("[aria-invalid]")) {
    field.removeAttribute("aria-invalid");
  }
}
