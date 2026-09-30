/* =====================================================
   PretoTecnologi — catálogo, filtros y carrito
   ===================================================== */
$(function () {
	'use strict';

	var PRODUCTOS = [
		{ id: 1, nombre: 'Smartphone Pro 128 GB', cat: 'smartphones', precio: 649990, img: 'img/1.jpg',
		  desc: 'Pantalla OLED de 6,1", triple cámara y batería para todo el día.',
		  specs: ['Pantalla OLED 6,1"', '128 GB de almacenamiento', 'Cámara principal 48 MP', 'Carga rápida'] },
		{ id: 2, nombre: 'Computador todo en uno 24"', cat: 'computadores', precio: 1149990, img: 'img/2.jpg',
		  desc: 'Diseño delgado con pantalla 4,5K, ideal para trabajo creativo y oficina.',
		  specs: ['Pantalla 24" 4,5K', '16 GB de RAM', 'SSD de 512 GB', 'Teclado y mouse incluidos'] },
		{ id: 3, nombre: 'Cámara réflex 24 MP + lente 18-55 mm', cat: 'camaras', precio: 589990, img: 'img/3.jpg',
		  desc: 'Perfecta para dar el salto a la fotografía profesional.',
		  specs: ['Sensor APS-C de 24 MP', 'Video Full HD', 'Wi-Fi y Bluetooth', 'Lente 18-55 mm incluido'] },
		{ id: 4, nombre: 'Smartwatch deportivo', cat: 'accesorios', precio: 229990, img: 'img/4.jpg',
		  desc: 'Mide tu actividad, ritmo cardíaco y recibe notificaciones en la muñeca.',
		  specs: ['Pantalla siempre activa', 'GPS integrado', 'Resistente al agua 50 m', 'Hasta 18 h de batería'] },
		{ id: 5, nombre: 'Teclado inalámbrico recargable', cat: 'accesorios', precio: 69990, img: 'img/5.jpg',
		  desc: 'Perfil bajo, teclas silenciosas y conexión Bluetooth multi-dispositivo.',
		  specs: ['Bluetooth 5.0', 'Batería de 1 mes', 'Distribución en español', 'Aluminio'] },
		{ id: 6, nombre: 'Tablet 10,9" Wi-Fi 64 GB', cat: 'tablets', precio: 429990, img: 'img/6.jpg',
		  desc: 'Para estudiar, dibujar o ver series con colores vibrantes.',
		  specs: ['Pantalla 10,9" Liquid', '64 GB', 'Compatible con lápiz', 'Cámara frontal ultra gran angular'] },
		{ id: 7, nombre: 'Notebook ultradelgado 14"', cat: 'notebooks', precio: 999990, img: 'img/7.jpg',
		  desc: 'Liviano, silencioso y con batería para toda la jornada.',
		  specs: ['Pantalla 14" Retina', '16 GB de RAM', 'SSD de 512 GB', 'Hasta 18 h de batería'] },
		{ id: 8, nombre: 'Cámara compacta retro', cat: 'camaras', precio: 319990, img: 'img/8.jpg',
		  desc: 'Estilo clásico con tecnología actual: fotos nítidas en un cuerpo compacto.',
		  specs: ['Sensor de 20 MP', 'Zoom óptico 3x', 'Visor electrónico', 'Diseño metálico'] }
	];

	var CATEGORIAS = {
		todos: 'Todos', computadores: 'Computadores', notebooks: 'Notebooks', smartphones: 'Smartphones',
		tablets: 'Tablets', camaras: 'Cámaras', accesorios: 'Accesorios'
	};
	var ENVIO_GRATIS_DESDE = 100000;
	var COSTO_ENVIO = 4990;
	var CLAVE = 'pretotec_carrito';

	var fmt = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
	function precio(n) { return fmt.format(n); }
	function porId(id) { return PRODUCTOS.filter(function (p) { return p.id === +id; })[0]; }
	function escapar(t) { return $('<div>').text(t).html(); }

	/* ---------- Estado ---------- */
	var filtro = { cat: 'todos', texto: '' };
	var carrito = cargar();

	function cargar() {
		try {
			var c = JSON.parse(localStorage.getItem(CLAVE) || '[]');
			return $.isArray(c) ? c.filter(function (i) { return porId(i.id) && i.cant > 0; }) : [];
		} catch (e) { return []; }
	}
	function guardar() {
		try { localStorage.setItem(CLAVE, JSON.stringify(carrito)); } catch (e) { /* sin almacenamiento */ }
	}

	/* ---------- Catálogo ---------- */
	var $grid = $('#grid-productos');

	function normalizar(t) { return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

	function renderProductos() {
		var texto = normalizar(filtro.texto.trim());
		var lista = PRODUCTOS.filter(function (p) {
			var okCat = filtro.cat === 'todos' || p.cat === filtro.cat;
			var okTexto = !texto || normalizar(p.nombre + ' ' + p.desc + ' ' + CATEGORIAS[p.cat]).indexOf(texto) !== -1;
			return okCat && okTexto;
		});

		$grid.empty();
		$.each(lista, function (i, p) {
			var html =
				'<div class="col-xs-12 col-sm-6 col-md-3 producto" style="animation-delay:' + (i * 0.05) + 's">' +
				'  <div class="thumbnail">' +
				'    <a href="#" class="thumb-img" data-detalle="' + p.id + '" aria-label="Ver detalles de ' + escapar(p.nombre) + '">' +
				'      <img src="' + p.img + '" alt="' + escapar(p.nombre) + '" loading="lazy">' +
				'    </a>' +
				'    <div class="caption">' +
				'      <span class="categoria">' + CATEGORIAS[p.cat] + '</span>' +
				'      <h3>' + escapar(p.nombre) + '</h3>' +
				'      <p class="desc">' + escapar(p.desc) + '</p>' +
				'      <p class="precio">' + precio(p.precio) + '</p>' +
				'      <p class="acciones">' +
				'        <button class="btn btn-primary" data-agregar="' + p.id + '"><span class="glyphicon glyphicon-shopping-cart"></span> Comprar</button>' +
				'        <button class="btn btn-default" data-detalle="' + p.id + '">Detalles</button>' +
				'      </p>' +
				'    </div>' +
				'  </div>' +
				'</div>';
			$grid.append(html);
		});

		$('#sin-resultados').prop('hidden', lista.length > 0);
		var estado = lista.length + (lista.length === 1 ? ' producto' : ' productos');
		if (filtro.cat !== 'todos') estado += ' en ' + CATEGORIAS[filtro.cat];
		if (texto) estado += ' para “' + filtro.texto.trim() + '”';
		$('#estado-filtro').text(estado);
		$('#filtros .btn').removeClass('active').filter('[data-cat="' + filtro.cat + '"]').addClass('active');
	}

	function aplicarCategoria(cat, desplazar) {
		filtro.cat = CATEGORIAS[cat] ? cat : 'todos';
		renderProductos();
		if (desplazar) irA($('#productos'));
	}

	function irA($el) {
		var y = $el.offset().top - $('.navbar').outerHeight() - 10;
		$('html, body').stop().animate({ scrollTop: Math.max(0, y) }, 600);
	}

	$('#filtros').on('click', '.btn', function () { aplicarCategoria($(this).data('cat'), false); });
	$(document).on('click', '#menu-categorias a, .carousel-caption a[data-cat]', function (e) {
		e.preventDefault();
		$('#btn-colapsar').collapse('hide');
		aplicarCategoria($(this).data('cat'), true);
	});

	$('#buscador').on('input', function () { filtro.texto = $(this).val(); renderProductos(); });
	$('#form-busqueda').on('submit', function (e) {
		e.preventDefault();
		filtro.texto = $('#buscador').val();
		renderProductos();
		$('#btn-colapsar').collapse('hide');
		irA($('#productos'));
	});
	$('#limpiar-filtros').on('click', function () {
		filtro = { cat: 'todos', texto: '' };
		$('#buscador').val('');
		renderProductos();
	});

	$(document).on('click', '[data-scroll]', function (e) {
		e.preventDefault();
		$('#btn-colapsar').collapse('hide');
		$('html, body').stop().animate({ scrollTop: 0 }, 600);
	});

	/* ---------- Detalle ---------- */
	var detalleActual = null;
	$(document).on('click', '[data-detalle]', function (e) {
		e.preventDefault();
		var p = porId($(this).data('detalle'));
		if (!p) return;
		detalleActual = p;
		$('#detalle-titulo').text(p.nombre);
		$('#detalle-img').attr({ src: p.img, alt: p.nombre });
		$('#detalle-cat').text(CATEGORIAS[p.cat]);
		$('#detalle-precio').text(precio(p.precio));
		$('#detalle-desc').text(p.desc);
		$('#detalle-specs').html($.map(p.specs, function (s) { return '<li><span class="glyphicon glyphicon-ok"></span> ' + escapar(s) + '</li>'; }).join(''));
		$('#detalle-cant').val(1);
		$('#modal-detalle').modal('show');
	});
	$('#modal-detalle').on('click', '[data-cant]', function () {
		var v = Math.min(10, Math.max(1, (parseInt($('#detalle-cant').val(), 10) || 1) + (+$(this).data('cant'))));
		$('#detalle-cant').val(v);
	});
	$('#detalle-cant').on('change', function () {
		$(this).val(Math.min(10, Math.max(1, parseInt($(this).val(), 10) || 1)));
	});
	$('#detalle-agregar').on('click', function () {
		if (!detalleActual) return;
		agregar(detalleActual.id, parseInt($('#detalle-cant').val(), 10) || 1);
		$('#modal-detalle').modal('hide');
	});

	/* ---------- Carrito ---------- */
	function agregar(id, cant) {
		cant = cant || 1;
		var item = carrito.filter(function (i) { return i.id === +id; })[0];
		if (item) item.cant = Math.min(10, item.cant + cant);
		else carrito.push({ id: +id, cant: Math.min(10, cant) });
		guardar();
		actualizarCarrito();
		avisar(porId(id).nombre + ' se agregó al carrito');
		$('.contador-carrito').addClass('rebote');
		setTimeout(function () { $('.contador-carrito').removeClass('rebote'); }, 500);
	}

	$(document).on('click', '[data-agregar]', function () { agregar($(this).data('agregar'), 1); });

	function totales() {
		var subtotal = carrito.reduce(function (s, i) { return s + porId(i.id).precio * i.cant; }, 0);
		var envio = subtotal === 0 || subtotal >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO;
		return { subtotal: subtotal, envio: envio, total: subtotal + envio, unidades: carrito.reduce(function (s, i) { return s + i.cant; }, 0) };
	}

	function actualizarCarrito() {
		var t = totales();
		$('.contador-carrito').text(t.unidades);
		var vacio = carrito.length === 0;
		$('#carrito-vacio').toggle(vacio);
		$('#carrito-lleno').toggle(!vacio);
		$('#vaciar-carrito, #ir-checkout').prop('disabled', vacio);

		var $items = $('#carrito-items').empty();
		$.each(carrito, function (_, i) {
			var p = porId(i.id);
			$items.append(
				'<tr>' +
				'<td><div class="item-carrito"><img src="' + p.img + '" alt=""><div><b>' + escapar(p.nombre) + '</b><small>' + precio(p.precio) + ' c/u</small></div></div></td>' +
				'<td class="text-center"><div class="btn-group btn-group-sm" role="group" aria-label="Cantidad">' +
				'<button class="btn btn-default" data-menos="' + p.id + '" aria-label="Quitar uno">−</button>' +
				'<span class="btn btn-default disabled cant">' + i.cant + '</span>' +
				'<button class="btn btn-default" data-mas="' + p.id + '" aria-label="Agregar uno">+</button></div></td>' +
				'<td class="text-right"><b>' + precio(p.precio * i.cant) + '</b></td>' +
				'<td class="text-right"><button class="btn btn-link text-danger" data-quitar="' + p.id + '" aria-label="Eliminar"><span class="glyphicon glyphicon-remove"></span></button></td>' +
				'</tr>'
			);
		});

		$('#res-subtotal').text(precio(t.subtotal));
		$('#res-envio').text(t.envio === 0 ? 'Gratis' : precio(t.envio));
		$('#res-total, #checkout-total').text(precio(t.total));
		$('#nota-envio').text(t.subtotal > 0 && t.subtotal < ENVIO_GRATIS_DESDE
			? 'Te faltan ' + precio(ENVIO_GRATIS_DESDE - t.subtotal) + ' para el envío gratis.'
			: (t.subtotal > 0 ? '¡Tienes envío gratis!' : ''));
	}

	function cambiar(id, delta) {
		$.each(carrito, function (_, i) { if (i.id === +id) i.cant = Math.min(10, i.cant + delta); });
		carrito = carrito.filter(function (i) { return i.cant > 0; });
		guardar(); actualizarCarrito();
	}
	$('#carrito-items')
		.on('click', '[data-mas]', function () { cambiar($(this).data('mas'), 1); })
		.on('click', '[data-menos]', function () { cambiar($(this).data('menos'), -1); })
		.on('click', '[data-quitar]', function () {
			var id = +$(this).data('quitar');
			carrito = carrito.filter(function (i) { return i.id !== id; });
			guardar(); actualizarCarrito();
		});

	$('#vaciar-carrito').on('click', function () { carrito = []; guardar(); actualizarCarrito(); });

	$(document).on('click', '[data-abrir-carrito]', function (e) {
		e.preventDefault();
		$('#btn-colapsar').collapse('hide');
		$('.modal.in').not('#modal-carrito').modal('hide');
		$('#modal-carrito').modal('show');
	});
	$('[data-ir-productos]').on('click', function () { setTimeout(function () { irA($('#productos')); }, 350); });

	/* ---------- Aviso flotante ---------- */
	var avisoTimer;
	function avisar(texto) {
		$('#aviso-texto').text(texto);
		$('#aviso').addClass('visible');
		clearTimeout(avisoTimer);
		avisoTimer = setTimeout(function () { $('#aviso').removeClass('visible'); }, 2800);
	}

	/* ---------- Validación genérica ---------- */
	function validar($input, mensaje) {
		var $g = $input.closest('.form-group');
		$g.toggleClass('has-error', !!mensaje);
		$g.find('.help-block').text(mensaje || '');
		return !mensaje;
	}
	var reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

	/* ---------- Checkout ---------- */
	$('#ir-checkout').on('click', function () {
		if (!carrito.length) return;
		$('#modal-carrito').one('hidden.bs.modal', function () { $('#modal-checkout').modal('show'); }).modal('hide');
	});
	$('#volver-carrito').on('click', function () {
		$('#modal-checkout').one('hidden.bs.modal', function () { $('#modal-carrito').modal('show'); }).modal('hide');
	});

	$('#form-checkout').on('submit', function (e) {
		e.preventDefault();
		var ok = [
			validar($('#c-nombre'), $.trim($('#c-nombre').val()).length < 3 ? 'Ingresa tu nombre completo.' : ''),
			validar($('#c-email'), reEmail.test($.trim($('#c-email').val())) ? '' : 'Ingresa un correo válido.'),
			validar($('#c-direccion'), $.trim($('#c-direccion').val()).length < 5 ? 'Ingresa la dirección de despacho.' : ''),
			validar($('#c-comuna'), $.trim($('#c-comuna').val()).length < 3 ? 'Ingresa tu comuna.' : '')
		].every(Boolean);
		if (!ok) { $(this).find('.has-error input').first().trigger('focus'); return; }

		var t = totales();
		var numero = 'PT-' + String(Date.now()).slice(-6);
		var pago = $('input[name="pago"]:checked').val();
		$('#exito-numero').text(numero);
		$('#exito-detalle').text(t.unidades + (t.unidades === 1 ? ' producto' : ' productos') + ' · ' + precio(t.total) + ' · ' + pago + '. Enviamos el resumen a ' + $.trim($('#c-email').val()) + '.');

		try {
			var pedidos = JSON.parse(localStorage.getItem('pretotec_pedidos') || '[]');
			pedidos.push({ numero: numero, items: carrito, total: t.total, fecha: new Date().toISOString() });
			localStorage.setItem('pretotec_pedidos', JSON.stringify(pedidos));
		} catch (err) { /* sin almacenamiento */ }

		carrito = []; guardar(); actualizarCarrito();
		this.reset();
		$('#modal-checkout').one('hidden.bs.modal', function () { $('#modal-exito').modal('show'); }).modal('hide');
	});

	/* ---------- Contacto ---------- */
	$('#form-contacto').on('submit', function (e) {
		e.preventDefault();
		var ok = [
			validar($('#ct-nombre'), $.trim($('#ct-nombre').val()).length < 2 ? 'Escribe tu nombre.' : ''),
			validar($('#ct-email'), reEmail.test($.trim($('#ct-email').val())) ? '' : 'Ingresa un correo válido.'),
			validar($('#ct-mensaje'), $.trim($('#ct-mensaje').val()).length < 10 ? 'Escribe un mensaje de al menos 10 caracteres.' : '')
		].every(Boolean);
		if (!ok) return;
		$('#contacto-ok').prop('hidden', false);
		this.reset();
	});
	$('#modal-contacto').on('hidden.bs.modal', function () {
		$('#contacto-ok').prop('hidden', true);
		$(this).find('.form-group').removeClass('has-error').find('.help-block').text('');
	});

	/* ---------- Inicio ---------- */
	renderProductos();
	actualizarCarrito();
});
