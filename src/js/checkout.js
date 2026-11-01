import { getItems, getTotals, clearCart } from "./cart.js";
import { formatPrice } from "./format.js";
import { showView } from "./dialogs.js";
import {
  validateForm,
  watchFields,
  resetForm,
  checkoutRules,
} from "./forms.js";

const PROCESSING_MS = 900;

/* Los elementos se buscan al iniciar y no al importar el módulo: si falta
   alguno en el HTML solo el checkout deja de funcionar, no toda la página */
let dialog = null;
let form = null;
let submit = null;

function createOrderCode() {
  return `BL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function fillConfirmation(order) {
  const values = {
    nombre: order.nombre.split(" ")[0],
    codigo: order.codigo,
    total: formatPrice(order.total),
    ciudad: order.ciudad,
  };

  for (const [key, value] of Object.entries(values)) {
    dialog.querySelector(`[data-confirm="${key}"]`).textContent = value;
  }
}

function handleSubmit(event) {
  event.preventDefault();
  if (submit.disabled) return;
  if (!validateForm(form, checkoutRules)) return;

  if (getItems().length === 0) {
    showView(dialog, "cart");
    return;
  }

  /* El total se lee antes de vaciar el carrito, no después */
  const data = new FormData(form);
  const order = {
    nombre: String(data.get("nombre")).trim(),
    ciudad: String(data.get("ciudad")).trim(),
    total: getTotals().total,
    codigo: createOrderCode(),
  };

  submit.disabled = true;
  submit.textContent = "Procesando pedido...";

  setTimeout(() => {
    clearCart();
    fillConfirmation(order);
    showView(dialog, "confirmed");
    dialog.querySelector('[data-view="confirmed"] .confirm__title').focus();

    resetForm(form);
    submit.disabled = false;
    submit.textContent = "Confirmar pedido";
  }, PROCESSING_MS);
}

function handleClick(event) {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  if (button.dataset.action === "go-checkout") {
    if (getItems().length === 0) return;
    showView(dialog, "checkout");
    form.elements.nombre.focus();
  }

  if (button.dataset.action === "back-to-cart") {
    showView(dialog, "cart");
    dialog.querySelector('[data-action="go-checkout"]').focus();
  }
}

export function initCheckout() {
  dialog = document.getElementById("dialog-cart");
  form = document.getElementById("form-checkout");

  if (!dialog || !form) {
    console.warn("Checkout: faltan #dialog-cart o #form-checkout en el HTML");
    return;
  }

  submit = form.querySelector('[type="submit"]');

  if (!submit) {
    console.warn(
      'Checkout: falta el botón [type="submit"] dentro de #form-checkout',
    );
    return;
  }

  dialog.addEventListener("click", handleClick);
  form.addEventListener("submit", handleSubmit);
  watchFields(form, checkoutRules);
}
