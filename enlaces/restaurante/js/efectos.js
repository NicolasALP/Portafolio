/* =====================================================
   Café Preto — efectos e interacción (jQuery)
   ===================================================== */
$(function () {
  var $win = $(window);

  $('.anio').text(new Date().getFullYear());

  /* ----- Efecto menú: los enlaces bajan uno a uno ----- */
  if ($win.width() > 900) {
    $('.menu a').each(function (index) {
      $(this).css({ top: '-120px' }).animate({ top: 0 }, 1100 + index * 220);
    });
  }

  /* ----- Efecto de entrada de los textos del header ----- */
  if ($win.width() > 800) {
    $('.hero .textos').css({ opacity: 0, marginTop: 40 }).animate({ opacity: 1, marginTop: 0 }, 1400);
  }

  /* ----- Navegación fija con fondo al hacer scroll ----- */
  var $nav = $('#nav');
  function navFija() { $nav.toggleClass('is-fija', $win.scrollTop() > 60); }
  $win.on('scroll', navFija);
  navFija();

  /* ----- Menú móvil ----- */
  var $menu = $('#menu');
  var $toggle = $('#nav-toggle');
  function cerrarMenu() {
    $menu.removeClass('is-abierto');
    $toggle.attr({ 'aria-expanded': 'false', 'aria-label': 'Abrir menú' }).find('i').removeClass('fa-xmark').addClass('fa-bars');
  }
  $toggle.on('click', function () {
    var abierto = $menu.toggleClass('is-abierto').hasClass('is-abierto');
    $toggle.attr({ 'aria-expanded': String(abierto), 'aria-label': abierto ? 'Cerrar menú' : 'Abrir menú' })
      .find('i').toggleClass('fa-bars', !abierto).toggleClass('fa-xmark', abierto);
  });

  /* ----- Scroll suave: la posición se calcula al hacer clic ----- */
  $('a[href^="#"]').on('click', function (e) {
    var destino = $(this).attr('href');
    if (destino.length < 2) return;
    var $d = $(destino);
    if (!$d.length) return;
    e.preventDefault();
    cerrarMenu();
    var y = destino === '#inicio' ? 0 : $d.offset().top - ($nav.outerHeight() - 2);
    $('html, body').stop().animate({ scrollTop: y }, 800);
  });

  /* ----- Pestañas de la carta ----- */
  $('.carta__tab').on('click', function () {
    var $t = $(this);
    $('.carta__tab').removeClass('is-activa').attr('aria-selected', 'false');
    $t.addClass('is-activa').attr('aria-selected', 'true');
    $('.carta__panel').removeClass('is-activa').attr('hidden', true);
    $('#' + $t.attr('aria-controls')).addClass('is-activa').removeAttr('hidden');
  });

  /* ----- Visor de galería ----- */
  var $fotos = $('.galeria .foto');
  var $lb = $('#lightbox');
  var actual = 0;
  var $ultimoFoco = null;

  function mostrarFoto(i) {
    actual = (i + $fotos.length) % $fotos.length;
    var $img = $fotos.eq(actual).find('img');
    $lb.find('img').attr({ src: $img.attr('src'), alt: $img.attr('alt') });
    $lb.find('figcaption').text($img.attr('alt') + '  ·  ' + (actual + 1) + ' / ' + $fotos.length);
  }
  function cerrarVisor() {
    $lb.attr('hidden', true);
    $('body').css('overflow', '');
    if ($ultimoFoco) $ultimoFoco.trigger('focus');
  }
  $fotos.on('click', function () {
    $ultimoFoco = $(this);
    mostrarFoto(+$(this).data('index'));
    $lb.removeAttr('hidden');
    $('body').css('overflow', 'hidden');
    $lb.find('.lightbox__cerrar').trigger('focus');
  });
  $lb.find('.lightbox__cerrar').on('click', cerrarVisor);
  $lb.find('.lightbox__prev').on('click', function () { mostrarFoto(actual - 1); });
  $lb.find('.lightbox__next').on('click', function () { mostrarFoto(actual + 1); });
  $lb.on('click', function (e) { if (e.target === this) cerrarVisor(); });

  // Gesto de deslizar en celulares
  var toqueX = null;
  $lb.on('touchstart', function (e) { toqueX = e.originalEvent.changedTouches[0].clientX; });
  $lb.on('touchend', function (e) {
    if (toqueX === null) return;
    var dx = e.originalEvent.changedTouches[0].clientX - toqueX;
    if (Math.abs(dx) > 50) mostrarFoto(actual + (dx < 0 ? 1 : -1));
    toqueX = null;
  });

  /* ----- Reservas ----- */
  var $form = $('#form-reserva');
  var $fecha = $('#r-fecha');
  var $hora = $('#r-hora');
  var $modal = $('#modal-reserva');
  var ultimaReserva = null;

  function dosDigitos(n) { return (n < 10 ? '0' : '') + n; }
  function fechaISO(d) { return d.getFullYear() + '-' + dosDigitos(d.getMonth() + 1) + '-' + dosDigitos(d.getDate()); }
  function aFecha(iso) { var p = iso.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }

  var hoy = new Date();
  var limite = new Date(); limite.setDate(limite.getDate() + 60);
  $fecha.attr({ min: fechaISO(hoy), max: fechaISO(limite) });

  // Horarios: L-V 08:00-19:00 y S-D 11:00-23:00 (última reserva 1 hora antes del cierre)
  function horariosPara(iso) {
    var d = aFecha(iso);
    var finde = d.getDay() === 0 || d.getDay() === 6;
    var inicio = finde ? 11 : 8;
    var fin = finde ? 22 : 18;
    var ahora = new Date();
    var esHoy = fechaISO(ahora) === iso;
    var lista = [];
    for (var h = inicio; h <= fin; h++) {
      for (var m = 0; m < 60; m += 30) {
        if (h === fin && m > 0) continue;
        if (esHoy && (h * 60 + m) <= (ahora.getHours() * 60 + ahora.getMinutes() + 30)) continue;
        lista.push(dosDigitos(h) + ':' + dosDigitos(m));
      }
    }
    return lista;
  }

  $fecha.on('change', function () {
    var iso = $fecha.val();
    $hora.empty();
    if (!iso) { $hora.append('<option value="">Elige una fecha primero</option>'); return; }
    var lista = horariosPara(iso);
    if (!lista.length) { $hora.append('<option value="">Sin horarios disponibles ese día</option>'); return; }
    $hora.append('<option value="">Elige una hora</option>');
    $.each(lista, function (_, h) { $hora.append('<option value="' + h + '">' + h + ' hrs.</option>'); });
    validarCampo($fecha);
  });

  function marcar($el, mensaje) {
    var $c = $el.closest('.campo');
    $c.toggleClass('con-error', !!mensaje);
    $c.find('.error').text(mensaje || '');
    $el.attr('aria-invalid', mensaje ? 'true' : 'false');
    return !mensaje;
  }

  function validarCampo($el) {
    var v = $.trim($el.val());
    switch ($el.attr('id')) {
      case 'r-nombre': return marcar($el, v.length < 2 ? 'Escribe tu nombre.' : '');
      case 'r-email': return marcar($el, /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Ingresa un correo válido.');
      case 'r-fecha':
        if (!v) return marcar($el, 'Elige una fecha.');
        if (v < fechaISO(new Date())) return marcar($el, 'La fecha ya pasó.');
        if (v > $el.attr('max')) return marcar($el, 'Reservamos hasta 60 días de anticipación.');
        return marcar($el, '');
      case 'r-hora': return marcar($el, v ? '' : 'Elige una hora.');
      case 'r-telefono': return marcar($el, !v || /^[+()\d\s-]{8,20}$/.test(v) ? '' : 'Revisa el número.');
    }
    return true;
  }

  $form.find('input, select').on('blur change', function () {
    if ($(this).closest('.campo').find('.error').length) validarCampo($(this));
  });

  $form.on('submit', function (e) {
    e.preventDefault();
    var ok = true;
    $.each(['#r-nombre', '#r-email', '#r-fecha', '#r-hora', '#r-telefono'], function (_, sel) {
      if (!validarCampo($(sel))) ok = false;
    });
    if (!ok) { $form.find('.con-error').first().find('input, select').trigger('focus'); return; }

    var codigo = 'CP-' + Math.random().toString(36).slice(2, 6).toUpperCase();
    var fecha = aFecha($fecha.val());
    var fechaTexto = fecha.toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' });
    ultimaReserva = {
      codigo: codigo,
      nombre: $.trim($('#r-nombre').val()),
      email: $.trim($('#r-email').val()),
      fecha: $fecha.val(),
      hora: $hora.val(),
      personas: $('#r-personas').val(),
      nota: $.trim($('#r-nota').val())
    };

    try {
      var guardadas = JSON.parse(localStorage.getItem('cafepreto_reservas') || '[]');
      guardadas.push(ultimaReserva);
      localStorage.setItem('cafepreto_reservas', JSON.stringify(guardadas));
    } catch (err) { /* almacenamiento no disponible */ }

    $('#reserva-codigo').text(codigo);
    var $res = $('#reserva-resumen').empty();
    var filas = [
      ['Nombre', ultimaReserva.nombre],
      ['Fecha', fechaTexto.charAt(0).toUpperCase() + fechaTexto.slice(1)],
      ['Hora', ultimaReserva.hora + ' hrs.'],
      ['Personas', ultimaReserva.personas]
    ];
    if (ultimaReserva.nota) filas.push(['Comentario', ultimaReserva.nota]);
    $.each(filas, function (_, f) {
      $res.append($('<li>').append($('<span>').text(f[0]), $('<strong>').text(f[1])));
    });

    $modal.removeAttr('hidden');
    $('body').css('overflow', 'hidden');
    $('#btn-ics').trigger('focus');
    $form[0].reset();
    $hora.html('<option value="">Elige una fecha primero</option>');
  });

  function cerrarModal() { $modal.attr('hidden', true); $('body').css('overflow', ''); }
  $('#btn-cerrar-modal').on('click', cerrarModal);
  $modal.on('click', function (e) { if (e.target === this) cerrarModal(); });

  // Descarga un archivo .ics compatible con Google Calendar, Outlook y Apple Calendar
  $('#btn-ics').on('click', function () {
    if (!ultimaReserva) return;
    var p = ultimaReserva.fecha.split('-');
    var h = ultimaReserva.hora.split(':');
    var inicio = new Date(+p[0], +p[1] - 1, +p[2], +h[0], +h[1]);
    var fin = new Date(inicio.getTime() + 90 * 60000);
    function local(d) { return d.getFullYear() + dosDigitos(d.getMonth() + 1) + dosDigitos(d.getDate()) + 'T' + dosDigitos(d.getHours()) + dosDigitos(d.getMinutes()) + '00'; }
    var stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    var ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Cafe Preto//Reservas//ES', 'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      'UID:' + ultimaReserva.codigo + '-' + Date.now() + '@cafepreto',
      'DTSTAMP:' + stamp,
      'DTSTART:' + local(inicio),
      'DTEND:' + local(fin),
      'SUMMARY:Reserva en Café Preto (' + ultimaReserva.personas + ' personas)',
      'LOCATION:Centro de Copiapó\\, Región de Atacama\\, Chile',
      'DESCRIPTION:Código de reserva ' + ultimaReserva.codigo + '. Te guardamos la mesa 15 minutos.',
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = 'reserva-cafe-preto-' + ultimaReserva.codigo + '.ics';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  });

  /* ----- Tecla Escape cierra visor, modal y menú ----- */
  $(document).on('keydown', function (e) {
    if (!$lb.is('[hidden]')) {
      if (e.key === 'Escape') cerrarVisor();
      if (e.key === 'ArrowLeft') mostrarFoto(actual - 1);
      if (e.key === 'ArrowRight') mostrarFoto(actual + 1);
      return;
    }
    if (e.key === 'Escape') { if (!$modal.is('[hidden]')) cerrarModal(); cerrarMenu(); }
  });
});
