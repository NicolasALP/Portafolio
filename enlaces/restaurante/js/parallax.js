/* =====================================================
   Café Preto — efecto parallax (solo pantallas grandes)
   ===================================================== */
$(function () {
  var $win = $(window);
  var $textos = $('.hero .textos');
  var $articulo = $('.acerca-de article');
  var $seccion = $('.acerca-de');
  var reducir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function parallax() {
    if (reducir || $win.width() <= 900) {
      $textos.css({ transform: '', opacity: '' });
      $articulo.css('transform', '');
      return;
    }
    var scroll = $win.scrollTop();
    var alto = $win.height();

    // Los textos del header bajan más lento y se desvanecen
    $textos.css('transform', 'translate3d(0, ' + (scroll * 0.35) + 'px, 0)');
    if (scroll > 5) $textos.stop(true, true).css('opacity', Math.max(0, 1 - scroll / (alto * 0.8)));

    // La tarjeta "Nuestra historia" se desplaza suavemente sobre la foto
    var centro = $seccion.offset().top + $seccion.outerHeight() / 2 - scroll - alto / 2;
    var y = Math.max(-60, Math.min(60, centro * -0.12));
    $articulo.css('transform', 'translate3d(0, ' + y + 'px, 0)');
  }

  $win.on('scroll resize', parallax);
  parallax();
});
