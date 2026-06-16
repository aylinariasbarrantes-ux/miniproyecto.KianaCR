// ============================================================
// registro.js — Lógica de la página de Registro (Kiana CR)
// ============================================================



// ── Referencias del formulario ────────────────────────────────
var inputNombre = document.getElementById('nombre');
var inputTelefono = document.getElementById('telefono');
var inputCorreo = document.getElementById('correo');
var inputAnimal = document.getElementById('animal');
var selectVivienda = document.getElementById('vivienda');
var inputMensaje = document.getElementById('mensaje');

var btnEnviar = document.getElementById('btn-enviar');
var btnLimpiar = document.getElementById('btn-limpiar');
var btnLimpiarTodo = document.getElementById('btn-limpiar-todo');
var alertaForm = document.getElementById('alerta-form');

// ── Cargar solicitudes guardadas al iniciar ───────────────────
// DOMContentLoaded ya se ejecuta porque el script está al final del body
var solicitudes = cargarSolicitudesStorage();
renderizarSolicitudes();

// ── Validación en tiempo real (evento input) ──────────────────
inputNombre.addEventListener('input', function () {
    validarCampo(
        inputNombre,
        document.getElementById('error-nombre'),
        inputNombre.value.trim().length >= 3
    );
});

inputTelefono.addEventListener('input', function () {
    var limpio = inputTelefono.value.replace(/\D/g, '');
    validarCampo(
        inputTelefono,
        document.getElementById('error-telefono'),
        limpio.length === 8
    );
});

inputCorreo.addEventListener('input', function () {
    var regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    validarCampo(
        inputCorreo,
        document.getElementById('error-correo'),
        regexCorreo.test(inputCorreo.value.trim())
    );
});

inputAnimal.addEventListener('input', function () {
    validarCampo(
        inputAnimal,
        document.getElementById('error-animal'),
        inputAnimal.value.trim().length >= 2
    );
});

selectVivienda.addEventListener('change', function () {
    validarCampo(
        selectVivienda,
        document.getElementById('error-vivienda'),
        selectVivienda.value !== ''
    );
});

// ── Función de validación de campo ───────────────────────────
function validarCampo(input, spanError, esValido) {
    if (esValido) {
        input.classList.remove('invalido');
        input.classList.add('valido');
        spanError.classList.remove('visible');
    } else {
        input.classList.remove('valido');
        input.classList.add('invalido');
        spanError.classList.add('visible');
    }
    return esValido;
}

// ── Validar formulario completo al enviar ─────────────────────
function validarFormulario() {
    var regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var limpioPTel = inputTelefono.value.replace(/\D/g, '');

    var camposValidos = [
        validarCampo(inputNombre, document.getElementById('error-nombre'), inputNombre.value.trim().length >= 3),
        validarCampo(inputTelefono, document.getElementById('error-telefono'), limpioPTel.length === 8),
        validarCampo(inputCorreo, document.getElementById('error-correo'), regexCorreo.test(inputCorreo.value.trim())),
        validarCampo(inputAnimal, document.getElementById('error-animal'), inputAnimal.value.trim().length >= 2),
        validarCampo(selectVivienda, document.getElementById('error-vivienda'), selectVivienda.value !== '')
    ];

    // Retorna true solo si TODOS los campos son válidos
    return camposValidos.every(function (v) { return v === true; });
}

// ── Evento: enviar solicitud ──────────────────────────────────
btnEnviar.addEventListener('click', function () {
    ocultarAlerta();

    if (!validarFormulario()) {
        mostrarAlerta('❗ Por favor corregí los campos marcados en rojo antes de enviar.', 'error-general');
        return;
    }

    // Crear objeto solicitud
    var nuevaSolicitud = {
        id: Date.now(),   // ID único basado en la fecha actual
        nombre: inputNombre.value.trim(),
        telefono: inputTelefono.value.trim(),
        correo: inputCorreo.value.trim(),
        animal: inputAnimal.value.trim(),
        vivienda: selectVivienda.value,
        mensaje: inputMensaje.value.trim(),
        fecha: new Date().toLocaleDateString('es-CR')
    };

    // Agregar al arreglo y guardar en localStorage
    solicitudes.push(nuevaSolicitud);
    guardarSolicitudesStorage();

    // Actualizar el DOM sin recargar
    renderizarSolicitudes();
    mostrarAlerta('✅ ¡Solicitud enviada! Nos pondremos en contacto muy pronto, ' + nuevaSolicitud.nombre.split(' ')[0] + '.', 'exito');
    limpiarFormulario();
});

// ── Evento: limpiar formulario ────────────────────────────────
btnLimpiar.addEventListener('click', function () {
    var confirmar = confirm('¿Seguro que querés limpiar el formulario?');
    if (confirmar) {
        limpiarFormulario();
        ocultarAlerta();
    }
});

// ── Evento: limpiar todas las solicitudes ─────────────────────
btnLimpiarTodo.addEventListener('click', function () {
    if (solicitudes.length === 0) return;
    var confirmar = confirm('¿Seguro que querés eliminar todas las solicitudes? Esta acción no se puede deshacer.');
    if (confirmar) {
        solicitudes = [];
        guardarSolicitudesStorage();
        renderizarSolicitudes();
    }
});

// ── Función: limpiar campos del formulario ────────────────────
function limpiarFormulario() {
    inputNombre.value = '';
    inputTelefono.value = '';
    inputCorreo.value = '';
    inputAnimal.value = '';
    selectVivienda.value = '';
    inputMensaje.value = '';

    // Quitar clases de validación visual
    var campos = [inputNombre, inputTelefono, inputCorreo, inputAnimal, selectVivienda];
    campos.forEach(function (campo) {
        campo.classList.remove('valido', 'invalido');
    });

    // Ocultar mensajes de error
    var errores = document.querySelectorAll('.mensaje-error');
    errores.forEach(function (e) { e.classList.remove('visible'); });
}

// ── Función: renderizar lista de solicitudes ──────────────────
function renderizarSolicitudes() {
    var lista = document.getElementById('lista-solicitudes');
    var sinSolicitudes = document.getElementById('sin-solicitudes');
    var contador = document.getElementById('contador-solicitudes');

    lista.innerHTML = '';
    contador.textContent = solicitudes.length;

    if (solicitudes.length === 0) {
        sinSolicitudes.style.display = 'block';
        return;
    }

    sinSolicitudes.style.display = 'none';

    // Crear elemento por cada solicitud (manipulación del DOM)
    solicitudes.forEach(function (sol) {
        var item = document.createElement('div');
        item.classList.add('solicitud-item');
        item.setAttribute('data-id', sol.id);

        item.innerHTML =
            '<div class="solicitud-info">' +
            '<strong>🐾 ' + escaparHTML(sol.nombre) + '</strong>' +
            '<span>Animal: ' + escaparHTML(sol.animal) + ' · ' + escaparHTML(sol.vivienda) + '</span>' +
            '<span>📧 ' + escaparHTML(sol.correo) + ' · 📞 ' + escaparHTML(sol.telefono) + '</span>' +
            '<span style="font-size:0.78rem;color:#aaa;">Registrado el ' + sol.fecha + '</span>' +
            '</div>' +
            '<button class="btn-eliminar" data-id="' + sol.id + '" aria-label="Eliminar solicitud de ' + escaparHTML(sol.nombre) + '">🗑️</button>';

        lista.appendChild(item);
    });

    // Asignar eventos a botones de eliminar
    var botonesEliminar = lista.querySelectorAll('.btn-eliminar');
    botonesEliminar.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var id = parseInt(this.getAttribute('data-id'));
            eliminarSolicitud(id);
        });
    });
}

// ── Función: eliminar solicitud específica ────────────────────
function eliminarSolicitud(id) {
    solicitudes = solicitudes.filter(function (s) { return s.id !== id; });
    guardarSolicitudesStorage();
    renderizarSolicitudes();
}

// ── localStorage: cargar solicitudes ─────────────────────────
function cargarSolicitudesStorage() {
    var datos = localStorage.getItem('kiana_solicitudes');
    return datos ? JSON.parse(datos) : [];
}

// ── localStorage: guardar solicitudes ────────────────────────
function guardarSolicitudesStorage() {
    localStorage.setItem('kiana_solicitudes', JSON.stringify(solicitudes));
}

// ── Mostrar/ocultar alertas del formulario ────────────────────
function mostrarAlerta(mensaje, tipo) {
    alertaForm.textContent = mensaje;
    alertaForm.className = 'alerta ' + tipo;
    // Scroll automático hacia la alerta
    alertaForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function ocultarAlerta() {
    alertaForm.className = 'alerta';
    alertaForm.textContent = '';
}

// ── Utilidad: escapar HTML para prevenir XSS ─────────────────
function escaparHTML(texto) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(String(texto)));
    return div.innerHTML;
}
