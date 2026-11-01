const pad = (value) => String(value).padStart(2, "0");

export function initCountdown() {
  const root = document.querySelector("[data-countdown]");
  if (!root) return;

  const end = new Date(root.dataset.countdownEnd).getTime();
  if (Number.isNaN(end)) return;

  const fields = {
    days: root.querySelector('[data-unit="days"]'),
    hours: root.querySelector('[data-unit="hours"]'),
    minutes: root.querySelector('[data-unit="minutes"]'),
    seconds: root.querySelector('[data-unit="seconds"]'),
  };

  /* Se declara antes de tick(): si la oferta ya terminó, la primera llamada
     necesita poder limpiar el intervalo sin tocar una variable sin inicializar */
  let timer = null;

  function tick() {
    const remaining = Math.max(0, end - Date.now());
    const totalSeconds = Math.floor(remaining / 1000);

    fields.days.textContent = pad(Math.floor(totalSeconds / 86400));
    fields.hours.textContent = pad(Math.floor((totalSeconds % 86400) / 3600));
    fields.minutes.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
    fields.seconds.textContent = pad(totalSeconds % 60);

    if (remaining === 0) {
      clearInterval(timer);
      root.classList.add("countdown--ended");
    }
  }

  tick();
  timer = setInterval(tick, 1000);
}
