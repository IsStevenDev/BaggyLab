const FILTERS = {
  todos: () => true,
  nuevo: (tags) => tags.includes("nuevo"),
  mujer: (tags) => tags.includes("mujer") || tags.includes("unisex"),
  hombre: (tags) => tags.includes("hombre") || tags.includes("unisex"),
  calzado: (tags) => tags.includes("calzado"),
};

let cards = [];
let chips = [];
let counter = null;

export function initFilters() {
  cards = [...document.querySelectorAll(".catalog [data-tags]")];
  chips = [...document.querySelectorAll(".filters [data-filter]")];
  counter = document.querySelector("[data-product-count]");
}

export function applyFilter(name) {
  const key = Object.hasOwn(FILTERS, name) ? name : "todos";
  let visible = 0;

  for (const card of cards) {
    const show = FILTERS[key](card.dataset.tags.split(" "));
    card.hidden = !show;
    if (show) visible += 1;
  }

  for (const chip of chips) {
    chip.setAttribute("aria-pressed", String(chip.dataset.filter === key));
  }

  counter.textContent = visible === 1 ? "1 producto" : `${visible} productos`;
}
