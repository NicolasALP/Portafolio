/* =====================================================
   Preto Business — planes, contratación y contacto
   ===================================================== */
(function () {
	'use strict';

	var $ = function (s, c) { return (c || document).querySelector(s); };
	var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
	var fmt = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
	var DESCUENTO_ANUAL = 0.2;
	var ciclo = 'mensual';

	$$('.anio').forEach(function (el) { el.textContent = new Date().getFullYear(); });

	/* ---------- Mensual / anual ---------- */
	function precioPlan(plan) {
		var mensual = +plan.dataset.mensual;
		return ciclo === 'anual' ? Math.round(mensual * (1 - DESCUENTO_ANUAL) / 10) * 10 : mensual;
	}

	function pintarPrecios() {
		$$('.plan').forEach(function (plan) {
			var monto = plan.querySelector('.monto');
			var periodo = plan.querySelector('.periodo');
			var ahorro = plan.querySelector('.ahorro');
			monto.style.opacity = 0;
			setTimeout(function () {
				monto.textContent = fmt.format(precioPlan(plan));
				periodo.textContent = '/mes';
				monto.style.opacity = 1;
			}, 150);
			if (ciclo === 'anual') {
				var anual = precioPlan(plan) * 12;
				if (!ahorro) {
					ahorro = document.createElement('span');
					ahorro.className = 'ahorro';
					plan.querySelector('.precio').insertAdjacentElement('afterend', ahorro);
				}
				ahorro.textContent = 'Facturado ' + fmt.format(anual) + ' al año';
			} else if (ahorro) {
				ahorro.remove();
			}
		});
	}

	$$('.facturacion__op').forEach(function (btn) {
		btn.addEventListener('click', function () {
			ciclo = btn.dataset.ciclo;
			$$('.facturacion__op').forEach(function (b) {
				var on = b === btn;
				b.classList.toggle('activo', on);
				b.setAttribute('aria-checked', String(on));
			});
			pintarPrecios();
		});
	});

	/* ---------- Validación ---------- */
	var reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
	var reDominio = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z]{2,})+$/i;

	function marcar(input, mensaje) {
		var campo = input.closest('.campo');
		campo.classList.toggle('con-error', !!mensaje);
		campo.querySelector('.error').textContent = mensaje || '';
		input.setAttribute('aria-invalid', mensaje ? 'true' : 'false');
		return !mensaje;
	}

	/* ---------- Modal de contratación ---------- */
	var modal = $('#modal-plan');
	var planActual = null;
	var ultimoFoco = null;

	function abrirModal(plan) {
		planActual = plan;
		ultimoFoco = document.activeElement;
		$('#mp-plan').textContent = plan.dataset.plan;
		$('#mp-precio').textContent = fmt.format(precioPlan(plan));
		$('#mp-ciclo').textContent = ciclo === 'anual' ? '/mes · facturación anual' : '/mes · facturación mensual';
		$('#paso-formulario').hidden = false;
		$('#paso-exito').hidden = true;
		modal.hidden = false;
		document.body.style.overflow = 'hidden';
		setTimeout(function () { $('#mp-nombre').focus(); }, 50);
	}
	function cerrarModal() {
		modal.hidden = true;
		document.body.style.overflow = '';
		if (ultimoFoco) ultimoFoco.focus();
	}

	$$('[data-contratar]').forEach(function (btn) {
		btn.addEventListener('click', function () { abrirModal(btn.closest('.plan')); });
	});
	$('.modal-pb__cerrar').addEventListener('click', cerrarModal);
	modal.addEventListener('click', function (e) {
		if (e.target === modal || e.target.hasAttribute('data-cerrar-modal')) cerrarModal();
	});
	document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) cerrarModal(); });

	$('#form-plan').addEventListener('submit', function (e) {
		e.preventDefault();
		var nombre = $('#mp-nombre'), email = $('#mp-email'), empresa = $('#mp-empresa'), dominio = $('#mp-dominio');
		var terminos = $('#mp-terminos');
		var ok = [
			marcar(nombre, nombre.value.trim().length < 3 ? 'Escribe tu nombre y apellido.' : ''),
			marcar(email, reEmail.test(email.value.trim()) ? '' : 'Ingresa un correo válido.'),
			marcar(empresa, empresa.value.trim().length < 2 ? 'Escribe el nombre de tu empresa.' : ''),
			marcar(dominio, !dominio.value.trim() || reDominio.test(dominio.value.trim()) ? '' : 'Usa un formato como miempresa.cl')
		].every(Boolean);
		$('#mp-terminos-error').textContent = terminos.checked ? '' : 'Debes aceptar los términos para continuar.';
		if (!terminos.checked) ok = false;
		if (!ok) {
			var primero = this.querySelector('.con-error input') || (!terminos.checked && terminos);
			if (primero) primero.focus();
			return;
		}

		var fin = new Date(); fin.setDate(fin.getDate() + 14);
		$('#exito-texto').textContent = 'Activamos la prueba gratis del plan ' + planActual.dataset.plan + ' para ' + empresa.value.trim() +
			'. Enviamos las instrucciones de acceso a ' + email.value.trim() + '. Tu prueba termina el ' +
			fin.toLocaleDateString('es-CL', { day: 'numeric', month: 'long' }) + '.';
		$('#paso-formulario').hidden = true;
		$('#paso-exito').hidden = false;
		this.reset();
	});

	/* ---------- Formulario de contacto ---------- */
	$('#form-contacto').addEventListener('submit', function (e) {
		e.preventDefault();
		var n = $('#ct-nombre'), m = $('#ct-email'), t = $('#ct-mensaje');
		var ok = [
			marcar(n, n.value.trim().length < 2 ? 'Escribe tu nombre.' : ''),
			marcar(m, reEmail.test(m.value.trim()) ? '' : 'Ingresa un correo válido.'),
			marcar(t, t.value.trim().length < 10 ? 'Cuéntanos un poco más (mínimo 10 caracteres).' : '')
		].every(Boolean);
		if (!ok) return;
		$('#contacto-ok').hidden = false;
		this.reset();
		setTimeout(function () { $('#contacto-ok').hidden = true; }, 6000);
	});
})();
