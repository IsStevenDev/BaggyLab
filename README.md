# Baggy Lab

Tienda de ropa streetwear Y2K (pantalones baggy, oversize)
hecha con HTML, CSS y JavaScript puro. Sin frameworks ni dependencias: módulos
ES de navegador y CSS a mano.

## Cómo ejecutarla

El proyecto usa módulos ES, así que no basta con abrir `index.html` haciendo doble clic: el navegador bloquea los imports bajo `file://` y no carga el
JavaScript.

La forma más fácil es con **Live Server** (extensión de VS Code):

1. Abre la carpeta del proyecto en VS Code.
2. Abre `index.html` con clic derecho > **Open with Live Server**.
3. La página se abre en el navegador (por defecto en `http://127.0.0.1:5500`).

Cualquier servidor estático local sirve también, por ejemplo:

```bash
npx serve .
# o
python -m http.server
```

Luego entra a la dirección que indique la consola.

## Qué incluye

- Catálogo de productos con filtros (todos, nuevos, mujer, hombre, calzado).
- Ofertas con cuenta regresiva.
- Carrito de compras con cantidades, subtotal, envío y total, persistido en
  `localStorage`.
- Checkout con validación de campos y confirmación del pedido.
- Diálogos de carrito, contacto, envíos y cambios.
- Avisos flotantes (toasts) al agregar productos.
- Menú desplegable para móvil.
- Diseño responsive (móvil, tablet y escritorio) con soporte de
  `prefers-reduced-motion`.

## Estructura

```
index.html
src/
  css/
    styles.css        Estilos base, layout y diseño de componentes
    motion.css        Animaciones y transiciones
    interactive.css   Estados interactivos (carrito, filtros, toasts)
    dialogs.css       Diálogos, formularios y carrito
  js/
    main.js           Punto de entrada: delegación de clics y arranque
    menu.js           Menú móvil
    filters.js        Filtros del catálogo
    cart.js           Lógica del carrito y persistencia
    cart-view.js      Dibujo de la lista del carrito
    checkout.js       Formulario de compra y confirmación
    contact.js        Formulario de contacto
    dialogs.js        Apertura y cambio de vistas de los diálogos
    forms.js          Reglas de validación de los formularios
    toast.js          Avisos flotantes
    countdown.js      Cuenta regresiva de ofertas
    format.js         Formato de precios en pesos colombianos
```

## Navegador

Requiere un navegador moderno con soporte de módulos ES, `<dialog>`,
`localStorage` y `:has()`.

## Licencia

MIT. Ver [LICENSE](LICENSE).
