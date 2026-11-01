const STORAGE_KEY = "baggylab:cart";

export const MAX_QTY = 10;
export const FREE_SHIPPING_FROM = 200000;
export const SHIPPING_FEE = 12900;

let items = load();

function isValidItem(item) {
  return (
    item &&
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    Number.isFinite(item.price) &&
    item.price > 0 &&
    Number.isInteger(item.qty) &&
    item.qty > 0
  );
}

function load() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(parsed) ? parsed.filter(isValidItem) : [];
  } catch {
    return [];
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* Sin almacenamiento disponible el carrito sigue funcionando en memoria */
  }
}

export function getItems() {
  return items.map((item) => ({ ...item }));
}

export function getTotals() {
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;

  return { count, subtotal, shipping, total: subtotal + shipping };
}

/* Cada cambio se guarda y se anuncia con un evento: la interfaz escucha el
   evento y ningún módulo necesita conocer a los demás */
function notify() {
  save();
  document.dispatchEvent(
    new CustomEvent("cart:change", {
      detail: { items: getItems(), totals: getTotals() },
    }),
  );
}

export function addItem({ id, name, price }) {
  const existing = items.find((item) => item.id === id);

  if (existing) {
    if (existing.qty >= MAX_QTY) return false;
    existing.qty += 1;
  } else {
    items.push({ id, name, price, qty: 1 });
  }

  notify();
  return true;
}

export function setQty(id, qty) {
  const item = items.find((entry) => entry.id === id);
  if (!item) return;

  if (qty <= 0) {
    removeItem(id);
    return;
  }

  item.qty = Math.min(qty, MAX_QTY);
  notify();
}

export function removeItem(id) {
  items = items.filter((item) => item.id !== id);
  notify();
}

export function clearCart() {
  items = [];
  notify();
}
