import { initMenu } from "./menu.js";
import { initFilters, applyFilter } from "./filters.js";
import { initCountdown } from "./countdown.js";
import { initDialogs, openDialog } from "./dialogs.js";
import { initCartView } from "./cart-view.js";
import { initCheckout } from "./checkout.js";
import { initContact } from "./contact.js";
import { addItem, getTotals, MAX_QTY } from "./cart.js";
import { showToast } from "./toast.js";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const cartButton = document.querySelector(".cart-btn");
const cartCount = document.querySelector("[data-cart-count]");

function scrollBehavior() {
  return reducedMotion.matches ? "auto" : "smooth";
}

/* Se espera un fotograma para que el menú ya esté cerrado y el scroll
   de la página desbloqueado cuando empiece el desplazamiento */
function scrollToTarget(selector) {
  const target = document.querySelector(selector);
  if (!target) return false;

  requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  });
  return true;
}

function renderCartBadge({ count }) {
  cartCount.textContent = String(count);
  cartCount.hidden = count === 0;

  const label =
    count === 0
      ? "Abrir carrito"
      : `Abrir carrito, ${count} ${count === 1 ? "producto" : "productos"}`;
  cartButton.setAttribute("aria-label", label);
}

function bumpCartBadge() {
  cartCount.classList.remove("is-bumping");
  void cartCount.offsetWidth;
  cartCount.classList.add("is-bumping");
}

function flashButton(button) {
  if (button.dataset.label) return;

  button.dataset.label = button.textContent;
  button.textContent = "Agregado";
  button.classList.add("is-added");

  setTimeout(() => {
    button.textContent = button.dataset.label;
    delete button.dataset.label;
    button.classList.remove("is-added");
  }, 1200);
}

function handleAddToCart(button) {
  const card = button.closest("[data-id]");
  if (!card) return;

  const { id, name, price } = card.dataset;
  const added = addItem({ id, name, price: Number(price) });

  if (added) {
    showToast(`${name} agregado al carrito`);
    flashButton(button);
    bumpCartBadge();
  } else {
    showToast(`Máximo ${MAX_QTY} unidades por producto`);
  }
}

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("a, button");
  if (!trigger) return;

  const { action, filter, open } = trigger.dataset;

  if (action === "add-to-cart") {
    handleAddToCart(trigger);
    return;
  }

  if (action === "close-dialog") {
    trigger.closest("dialog")?.close();
    return;
  }

  if (action === "go-top") {
    event.preventDefault();
    applyFilter("todos");
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: scrollBehavior() });
    });
    return;
  }

  if (filter) {
    event.preventDefault();
    applyFilter(filter);
    if (!trigger.closest(".filters")) scrollToTarget("#catalogo");
    return;
  }

  if (open) {
    event.preventDefault();
    openDialog(open);
    return;
  }

  const href = trigger.getAttribute("href");
  if (href && href.length > 1 && href.startsWith("#")) {
    if (scrollToTarget(href)) event.preventDefault();
  }
});

document.addEventListener("cart:change", (event) => {
  renderCartBadge(event.detail.totals);
});

initMenu();
initFilters();
initCountdown();
initDialogs();
initCartView();
initCheckout();
initContact();
renderCartBadge(getTotals());
