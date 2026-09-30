# Portafolio · Nicolás López

Portafolio profesional de desarrollo web con estética tecnológica y 6 demos funcionales.

## Estructura

```
index.html                 Portafolio principal
assets/
  css/main.css             Estilos del portafolio (paleta y componentes)
  css/demo-bar.css         Botón "Volver al portafolio" de las demos
  css/fonts-demos.css      Fuentes locales de las demos
  js/main.js               Animaciones, filtros y formulario de contacto
  fonts/                   Fuentes locales (sin depender de Google Fonts)
  vendor/fontawesome/      Íconos Font Awesome 6 Free (local)
img/proyectos/             Capturas de las demos
enlaces/
  Proyecto/                ONI · portal de videojuegos (buscador, lector, newsletter)
  restaurante/             Café Preto · cafetería (galería, reservas + calendario .ics)
  Bootstrap3/              PretoTecnologi · tienda (filtros, carrito, checkout)
  Carrito/                 Universidad Online · carrito de cursos (LocalStorage)
  Startup/                 Preto Business · landing SaaS (planes mensual/anual)
  Formulario/              Validación de formularios (envío real con mailto)
```

## Formulario de contacto

El formulario del portafolio envía los mensajes con [FormSubmit](https://formsubmit.co) al correo
`nicolas.lopez.pasten@gmail.com` (constante `CONTACT_EMAIL` en `assets/js/main.js`).

1. Publica el sitio y envía un mensaje de prueba desde el formulario.
2. FormSubmit mandará un correo de activación: haz clic en **Activate Form**.
3. Desde ese momento los mensajes llegan directo a tu bandeja.

Si el servicio no responde, el formulario abre la aplicación de correo del visitante con el mensaje listo.

## Paleta (psicología del color)

| Color | Uso | Qué transmite |
|---|---|---|
| Azul `#3b82f6` | Títulos, íconos, enlaces | Confianza y profesionalismo |
| Cian `#22d3ee` | Detalles tecnológicos | Innovación y claridad |
| Naranjo `#ff8a1f` | Solo botones de contratación | Acción y entusiasmo (contraste con el azul) |
| Verde `#22c55e` | "Disponible", checks | Disponibilidad y seguridad |
| Azul noche `#05080f` | Fondo | Sofisticación y foco en el contenido |
