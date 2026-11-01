import {
  getItems,
  getTotals,
  setQty,
  removeItem,
  FREE_SHIPPING_FROM,
  MAX_QTY,
} from "./cart.js";
import { formatPrice } from "./format.js";

/* Los elementos se buscan al iniciar y no al importar el módulo: si falta
   alguno en el HTML solo el carrito deja de funcionar, no toda la página */
let dialog = null;
let list = null;
let empty = null;
let summary = null;
let hint = null;
let template = null;

/* La lista se redibuja entera en cada cambio, lo que destruye el botón que
   tenía el foco. Se recuerda cuál era para devolvérselo después */
let pendingFocus = null;

function buildItem(item) {
  const row = template.content.firstElementChild.cloneNode(true);
  row.dataset.id = item.id;

  row.querySelector(".cart-item__name").textContent = item.name;
  row.querySelector(".cart-item__price").textContent = formatPrice(
    item.price * item.qty,
  );
  row.querySelector(".cart-item__count").textContent = String(item.qty);

  row
    .querySelector('[data-action="qty-minus"]')
    .setAttribute("aria-label", `Quitar una unidad de ${item.name}`);

  const plus = row.querySelector('[data-action="qty-plus"]');
  plus.setAttribute("aria-label", `Agregar una unidad de ${item.name}`);
  plus.setAttribute("aria-disabled", String(item.qty >= MAX_QTY));

  row
    .querySelector('[data-action="remove-item"]')
    .setAttribute("aria-label", `Eliminar ${item.name} del carrito`);

  return row;
}

function restoreFocus() {
  if (!pendingFocus) return;

  const { id, action } = pendingFocus;
  pendingFocus = null;

  const row = [...list.children].find((entry) => entry.dataset.id === id);
  const target =
    row?.querySelector(`[data-action="${action}"]`) ??
    dialog.querySelector(".dialog__close");
  target.focus();
}

function renderCart({ items, totals }) {
  list.replaceChildren(...items.map(buildItem));

  const isEmpty = items.length === 0;
  empty.hidden = !isEmpty;
  list.hidden = isEmpty;
  summary.hidden = isEmpty;

  const labels = {
    subtotal: formatPrice(totals.subtotal),
    shipping: totals.shipping === 0 ? "Gratis" : formatPrice(totals.shipping),
    total: formatPrice(totals.total),
  };
  for (const node of dialog.querySelectorAll("[data-summary]")) {
    node.textContent = labels[node.dataset.summary];
  }

  const missing = FREE_SHIPPING_FROM - totals.subtotal;
  hint.textContent =
    missing > 0
      ? `Te faltan ${formatPrice(missing)} para envío gratis.`
      : "Tu envío es gratis.";

  restoreFocus();
}

function handleClick(event) {
  const button = event.target.closest("[data-action]");
  const row = button?.closest(".cart-item");
  if (!row) return;

  const id = row.dataset.id;
  const item = getItems().find((entry) => entry.id === id);
  if (!item) return;

  const action = button.dataset.action;

  if (action === "qty-plus") {
    if (item.qty >= MAX_QTY) return;
    pendingFocus = { id, action };
    setQty(id, item.qty + 1);
  } else if (action === "qty-minus") {
    pendingFocus = { id, action };
    setQty(id, item.qty - 1);
  } else if (action === "remove-item") {
    pendingFocus = { id, action };
    removeItem(id);
  }
}

export function initCartView() {
  dialog = document.getElementById("dialog-cart");

  if (!dialog) {
    console.warn("Carrito: falta #dialog-cart en el HTML");
    return;
  }

  list = dialog.querySelector("[data-cart-list]");
  empty = dialog.querySelector("[data-cart-empty]");
  summary = dialog.querySelector("[data-cart-summary]");
  hint = dialog.querySelector("[data-cart-hint]");
  template = document.getElementById("tpl-cart-item");

  if (!list || !empty || !summary || !hint || !template) {
    console.warn(
      "Carrito: faltan [data-cart-list], [data-cart-empty], [data-cart-summary], [data-cart-hint] o #tpl-cart-item en el HTML",
    );
    return;
  }

  dialog.addEventListener("click", handleClick);
  document.addEventListener("cart:change", (event) => {
    renderCart(event.detail);
  });
  renderCart({ items: getItems(), totals: getTotals() });
}
