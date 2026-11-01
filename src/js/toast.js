const region = document.querySelector("[data-toast-region]");

const VISIBLE_MS = 2800;
const LEAVE_MS = 300;
const MAX_TOASTS = 3;

export function showToast(message) {
  if (!region) return;

  const toast = document.createElement("p");
  toast.className = "toast";
  toast.textContent = message;
  region.append(toast);

  while (region.children.length > MAX_TOASTS) {
    region.firstElementChild.remove();
  }

  setTimeout(() => {
    toast.classList.add("toast--leaving");
    setTimeout(() => toast.remove(), LEAVE_MS);
  }, VISIBLE_MS);
}
