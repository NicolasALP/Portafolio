// =====================================================
// Validación de formulario + envío real con mailto:
// =====================================================

// Variables
const btnEnviar = document.querySelector('#enviar');
const btnReset = document.querySelector('#resetBtn');
const formulario = document.querySelector('#enviar-mail');
const spinner = document.querySelector('#spinner');

// Variables para campos
const email = document.querySelector('#email');
const asunto = document.querySelector('#asunto');
const mensaje = document.querySelector('#mensaje');
const contador = document.querySelector('#contador');

// Expresión regular para validar correos
const er = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Reglas de cada campo: devuelven un mensaje de error o '' si es válido
const reglas = {
    email: v => !v ? 'El destinatario es obligatorio.' : (er.test(v) ? '' : 'Escribe un correo válido, por ejemplo nombre@correo.com.'),
    asunto: v => !v ? 'El asunto es obligatorio.' : (v.length < 3 ? 'El asunto debe tener al menos 3 caracteres.' : ''),
    mensaje: v => !v ? 'El mensaje es obligatorio.' : (v.length < 10 ? `Faltan ${10 - v.length} caracteres (mínimo 10).` : '')
};

// Campos que el usuario ya tocó (para no mostrar errores antes de tiempo)
const tocados = new Set();

eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', iniciarApp);

    [email, asunto, mensaje].forEach(campo => {
        campo.addEventListener('blur', () => { tocados.add(campo.id); validarFormulario(); });
        campo.addEventListener('input', validarFormulario);
    });

    mensaje.addEventListener('input', () => {
        contador.textContent = `${mensaje.value.length} / ${mensaje.maxLength}`;
    });

    btnReset.addEventListener('click', resetearFormulario);
    formulario.addEventListener('submit', enviarEmail);
}

// Funciones
function iniciarApp() {
    btnEnviar.disabled = true;
    btnEnviar.classList.add('cursor-not-allowed', 'opacity-50');
}

function validarCampo(campo) {
    const error = reglas[campo.id](campo.value.trim());
    const mostrar = tocados.has(campo.id);
    const parrafo = document.querySelector(`#${campo.id}-error`);

    campo.classList.remove('border-red-500', 'border-green-500');
    if (mostrar || !error) {
        if (campo.value.trim() || mostrar) campo.classList.add(error ? 'border-red-500' : 'border-green-500');
    }
    parrafo.textContent = mostrar ? error : '';
    campo.setAttribute('aria-invalid', error && mostrar ? 'true' : 'false');
    return !error;
}

// Valida todo y habilita / deshabilita el botón
function validarFormulario() {
    const valido = [email, asunto, mensaje].map(validarCampo).every(Boolean);
    btnEnviar.disabled = !valido;
    btnEnviar.classList.toggle('cursor-not-allowed', !valido);
    btnEnviar.classList.toggle('opacity-50', !valido);
    return valido;
}

// Envía el email: abre la aplicación de correo con todo completado
function enviarEmail(e) {
    e.preventDefault();
    [email, asunto, mensaje].forEach(c => tocados.add(c.id));
    if (!validarFormulario()) return;

    spinner.style.display = 'flex';
    btnEnviar.disabled = true;

    const url = `mailto:${encodeURIComponent(email.value.trim())}` +
        `?subject=${encodeURIComponent(asunto.value.trim())}` +
        `&body=${encodeURIComponent(mensaje.value.trim())}`;

    setTimeout(() => {
        spinner.style.display = 'none';
        window.location.href = url;

        const parrafo = document.createElement('p');
        parrafo.innerHTML = '<i class="fa-solid fa-circle-check mr-2"></i> Abrimos tu aplicación de correo con el mensaje listo para enviar';
        parrafo.classList.add('text-center', 'my-6', 'p-3', 'bg-green-500', 'text-white', 'font-bold', 'mensaje-exito');
        formulario.insertBefore(parrafo, spinner);

        setTimeout(() => {
            parrafo.remove();
            resetearFormulario();
        }, 5000);
    }, 1500);
}

// Resetea el formulario
function resetearFormulario(e) {
    if (e) e.preventDefault();
    formulario.reset();
    tocados.clear();
    [email, asunto, mensaje].forEach(c => {
        c.classList.remove('border-red-500', 'border-green-500');
        c.removeAttribute('aria-invalid');
    });
    document.querySelectorAll('.error-campo').forEach(p => { p.textContent = ''; });
    contador.textContent = `0 / ${mensaje.maxLength}`;
    iniciarApp();
}
