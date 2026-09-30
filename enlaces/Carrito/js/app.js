// =====================================================
// Universidad Online — carrito de compras
// =====================================================

// Variables
const carrito = document.querySelector('#carrito');
const submenu = document.querySelector('#submenu-carrito');
const btnCarrito = document.querySelector('#img-carrito');
const listaCursos = document.querySelector('#lista-cursos');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const finalizarBtn = document.querySelector('#finalizar-compra');
const contador = document.querySelector('#contador');
const totalCarrito = document.querySelector('#total-carrito');
const carritoVacio = document.querySelector('#carrito-vacio');
const buscador = document.querySelector('#buscador');
const formBusqueda = document.querySelector('#busqueda');
const estadoBusqueda = document.querySelector('#estado-busqueda');
const sinResultados = document.querySelector('#sin-resultados');
const modal = document.querySelector('#modal-compra');
const CLAVE = 'universidad_carrito';

let articulosCarrito = [];

// Listeners
cargarEventListeners();

function cargarEventListeners() {
     // Agregar curso
     listaCursos.addEventListener('click', agregarCurso);

     // Eliminar curso o cambiar cantidad
     carrito.addEventListener('click', accionesCarrito);

     // Vaciar el carrito (corrige el error original: también se limpia el arreglo)
     vaciarCarritoBtn.addEventListener('click', e => {
          e.preventDefault();
          articulosCarrito = [];
          sincronizar();
     });

     // Abrir / cerrar el carrito con clic (funciona en celulares)
     btnCarrito.addEventListener('click', e => {
          e.stopPropagation();
          toggleCarrito();
     });
     document.addEventListener('click', e => {
          if (!submenu.contains(e.target)) toggleCarrito(false);
     });
     document.addEventListener('keydown', e => {
          if (e.key === 'Escape') { toggleCarrito(false); cerrarModal(); }
     });

     // Buscador
     buscador.addEventListener('input', () => filtrarCursos(buscador.value));
     formBusqueda.addEventListener('submit', e => {
          e.preventDefault();
          filtrarCursos(buscador.value);
          document.querySelector('#encabezado').scrollIntoView({ behavior: 'smooth' });
     });
     document.querySelector('#limpiar-busqueda').addEventListener('click', e => {
          e.preventDefault();
          buscador.value = '';
          filtrarCursos('');
     });

     // Finalizar compra
     finalizarBtn.addEventListener('click', e => {
          e.preventDefault();
          if (!articulosCarrito.length) return;
          toggleCarrito(false);
          abrirModal();
     });

     // Enlaces del footer y logo
     document.querySelectorAll('[data-accion]').forEach(a => a.addEventListener('click', e => {
          e.preventDefault();
          if (a.dataset.accion === 'buscar') {
               window.scrollTo({ top: 0, behavior: 'smooth' });
               setTimeout(() => buscador.focus(), 450);
          } else {
               window.scrollTo({ top: 0, behavior: 'smooth' });
               setTimeout(() => toggleCarrito(true), 450);
          }
     }));
     document.querySelector('#logo-link').addEventListener('click', e => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
     });

     // Cargar el carrito guardado
     document.addEventListener('DOMContentLoaded', () => {
          try {
               articulosCarrito = JSON.parse(localStorage.getItem(CLAVE)) || [];
          } catch (error) {
               articulosCarrito = [];
          }
          carritoHTML();
     });
}

// Funciones
function toggleCarrito(forzar) {
     const abrir = typeof forzar === 'boolean' ? forzar : !submenu.classList.contains('abierto');
     submenu.classList.toggle('abierto', abrir);
     btnCarrito.setAttribute('aria-expanded', String(abrir));
}

// Añade el curso al carrito
function agregarCurso(e) {
     if (e.target.classList.contains('agregar-carrito')) {
          e.preventDefault();
          const curso = e.target.closest('.card');
          leerDatosCurso(curso);
          e.target.textContent = '✓ Agregado';
          e.target.classList.add('agregado');
          setTimeout(() => {
               e.target.textContent = 'Agregar al carrito';
               e.target.classList.remove('agregado');
          }, 1200);
     }
}

// Lee los datos del curso
function leerDatosCurso(curso) {
     const infoCurso = {
          imagen: curso.querySelector('img').getAttribute('src'),
          titulo: curso.querySelector('h4').textContent,
          precio: curso.querySelector('.precio span').textContent,
          id: curso.querySelector('a.agregar-carrito').getAttribute('data-id'),
          cantidad: 1
     };

     // Si ya existe, aumenta la cantidad
     if (articulosCarrito.some(c => c.id === infoCurso.id)) {
          articulosCarrito = articulosCarrito.map(c => {
               if (c.id === infoCurso.id) c.cantidad++;
               return c;
          });
     } else {
          articulosCarrito = [...articulosCarrito, infoCurso];
     }

     sincronizar();
     contador.classList.remove('salto');
     void contador.offsetWidth;
     contador.classList.add('salto');
}

// Eliminar o cambiar cantidad dentro del carrito
function accionesCarrito(e) {
     const id = e.target.getAttribute('data-id');
     if (e.target.classList.contains('borrar-curso')) {
          e.preventDefault();
          articulosCarrito = articulosCarrito.filter(c => c.id !== id);
          sincronizar();
     } else if (e.target.classList.contains('cant-mas') || e.target.classList.contains('cant-menos')) {
          e.preventDefault();
          const delta = e.target.classList.contains('cant-mas') ? 1 : -1;
          articulosCarrito = articulosCarrito
               .map(c => (c.id === id ? { ...c, cantidad: c.cantidad + delta } : c))
               .filter(c => c.cantidad > 0);
          sincronizar();
     }
}

function precioNumero(texto) {
     return Number(texto.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
}

function formatoPrecio(n) {
     return '$' + n.toLocaleString('es-CL');
}

// Guarda y vuelve a pintar
function sincronizar() {
     try {
          localStorage.setItem(CLAVE, JSON.stringify(articulosCarrito));
     } catch (error) { /* almacenamiento no disponible */ }
     carritoHTML();
}

// Muestra los cursos en el carrito
function carritoHTML() {
     limpiarHTML();

     articulosCarrito.forEach(curso => {
          const row = document.createElement('tr');
          row.innerHTML = `
               <td><img src="${curso.imagen}" width="60" alt=""></td>
               <td class="nombre-curso"></td>
               <td>${curso.precio}</td>
               <td class="cantidad">
                    <a href="#" class="cant-menos" data-id="${curso.id}" aria-label="Quitar uno">−</a>
                    <span>${curso.cantidad}</span>
                    <a href="#" class="cant-mas" data-id="${curso.id}" aria-label="Agregar uno">+</a>
               </td>
               <td><a href="#" class="borrar-curso" data-id="${curso.id}" aria-label="Eliminar">X</a></td>
          `;
          row.querySelector('.nombre-curso').textContent = curso.titulo;
          contenedorCarrito.appendChild(row);
     });

     const unidades = articulosCarrito.reduce((t, c) => t + c.cantidad, 0);
     const total = articulosCarrito.reduce((t, c) => t + precioNumero(c.precio) * c.cantidad, 0);
     contador.textContent = unidades;
     contador.classList.toggle('oculto', unidades === 0);
     totalCarrito.textContent = formatoPrecio(total);
     const vacio = articulosCarrito.length === 0;
     carritoVacio.hidden = !vacio;
     carrito.classList.toggle('vacio', vacio);
}

// Elimina los cursos del tbody (forma rápida)
function limpiarHTML() {
     while (contenedorCarrito.firstChild) {
          contenedorCarrito.removeChild(contenedorCarrito.firstChild);
     }
}

// Buscador de cursos
function normalizar(t) {
     return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
}

function filtrarCursos(texto) {
     const q = normalizar(texto);
     let visibles = 0;
     listaCursos.querySelectorAll('.card').forEach(card => {
          const titulo = normalizar(card.querySelector('h4').textContent);
          const coincide = !q || q.split(/\s+/).every(p => titulo.includes(p));
          card.parentElement.hidden = !coincide;
          if (coincide) visibles++;
     });
     sinResultados.hidden = visibles > 0;
     estadoBusqueda.textContent = q ? `${visibles} ${visibles === 1 ? 'curso encontrado' : 'cursos encontrados'} para “${texto.trim()}”` : '';
}

// Modal de compra
function abrirModal() {
     const resumen = document.querySelector('#compra-resumen');
     resumen.innerHTML = '';
     let total = 0;
     articulosCarrito.forEach(c => {
          const li = document.createElement('li');
          const subtotal = precioNumero(c.precio) * c.cantidad;
          total += subtotal;
          li.innerHTML = '<span></span><b></b>';
          li.querySelector('span').textContent = `${c.titulo} × ${c.cantidad}`;
          li.querySelector('b').textContent = formatoPrecio(subtotal);
          resumen.appendChild(li);
     });
     document.querySelector('#compra-total').textContent = formatoPrecio(total);
     document.querySelector('#compra-paso1').hidden = false;
     document.querySelector('#compra-paso2').hidden = true;
     document.querySelector('#compra-error').textContent = '';
     modal.hidden = false;
     document.body.style.overflow = 'hidden';
     setTimeout(() => document.querySelector('#compra-email').focus(), 50);
}

function cerrarModal() {
     if (modal.hidden) return;
     modal.hidden = true;
     document.body.style.overflow = '';
}

modal.addEventListener('click', e => { if (e.target === modal) cerrarModal(); });
modal.querySelector('.modal-compra__cerrar').addEventListener('click', cerrarModal);
document.querySelector('#compra-listo').addEventListener('click', cerrarModal);

document.querySelector('#form-compra').addEventListener('submit', e => {
     e.preventDefault();
     const email = document.querySelector('#compra-email');
     const valido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
     document.querySelector('#compra-error').textContent = valido ? '' : 'Ingresa un correo válido para enviarte el acceso.';
     if (!valido) { email.focus(); return; }

     const cursos = articulosCarrito.reduce((t, c) => t + c.cantidad, 0);
     document.querySelector('#compra-mensaje').textContent =
          `Enviamos el acceso a ${cursos} ${cursos === 1 ? 'curso' : 'cursos'} a ${email.value.trim()}. ¡Disfruta aprendiendo!`;
     document.querySelector('#compra-paso1').hidden = true;
     document.querySelector('#compra-paso2').hidden = false;
     e.target.reset();
     articulosCarrito = [];
     sincronizar();
});
