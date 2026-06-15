// ============================================================
// inicio.js — Lógica de la página de Inicio (Kiana CR)
// ============================================================

// ── Toggle de información adicional ──────────────────────────
var btnToggle = document.getElementById('btn-toggle');
var infoExtra = document.getElementById('info-extra');
var toggleIcono = document.getElementById('toggle-icono');

if (btnToggle) {
    btnToggle.addEventListener('click', function () {
        var visible = infoExtra.classList.toggle('visible');
        toggleIcono.textContent = visible ? '➖' : '➕';
        btnToggle.setAttribute('aria-expanded', visible);
    });
}

// ── Estadísticas dinámicas desde JSON ────────────────────────
fetch('data/animales.json')
    .then(function (respuesta) { return respuesta.json(); })
    .then(function (animales) { renderizarEstadisticas(animales); })
    .catch(function (error) {
        console.error('Error cargando animales.json:', error);
        var grid = document.getElementById('stats-grid');
        if (grid) grid.innerHTML = '<p style="color:#888;grid-column:1/-1">No se pudieron cargar los datos.</p>';
    });

function renderizarEstadisticas(animales) {
    var grid = document.getElementById('stats-grid');
    if (!grid) return;

    var totalAnimales = animales.length;
    var totalPerros = animales.filter(function (a) { return a.especie === 'perro'; }).length;
    var totalGatos = animales.filter(function (a) { return a.especie === 'gato'; }).length;
    var totalDisponibles = animales.filter(function (a) { return a.estado === 'disponible'; }).length;

    var estadisticas = [
        { numero: totalAnimales, label: 'Animales registrados', icono: '🐾' },
        { numero: totalPerros, label: 'Perros disponibles', icono: '🐶' },
        { numero: totalGatos, label: 'Gatos disponibles', icono: '🐱' },
        { numero: totalDisponibles, label: 'Esperan un hogar', icono: '🏠' }
    ];

    grid.innerHTML = '';
    estadisticas.forEach(function (stat) {
        var card = document.createElement('div');
        card.classList.add('stat-card');
        card.innerHTML =
            '<span class="stat-numero">' + stat.icono + ' ' + stat.numero + '</span>' +
            '<span class="stat-label">' + stat.label + '</span>';
        grid.appendChild(card);
    });
}

// ── Donaciones ───────────────────────────────────────────────
var montoSeleccionado = 0;
var btnsMonto = document.querySelectorAll('.btn-monto');
var inputMonto = document.getElementById('monto-personalizado');
var totalDonado = parseFloat(localStorage.getItem('kiana_total_donado') || '0');

// Mostrar total acumulado
actualizarTotalDonado();

// Selección de monto rápido
btnsMonto.forEach(function (btn) {
    btn.addEventListener('click', function () {
        btnsMonto.forEach(function (b) { b.classList.remove('activo'); });
        btn.classList.add('activo');
        montoSeleccionado = parseFloat(btn.getAttribute('data-monto'));
        if (inputMonto) {
            inputMonto.value = '';
            inputMonto.classList.remove('valido', 'invalido');
        }
    });
});

// Monto personalizado
if (inputMonto) {
    inputMonto.addEventListener('input', function () {
        var val = parseFloat(inputMonto.value);
        if (!isNaN(val) && val >= 500) {
            montoSeleccionado = val;
            inputMonto.classList.add('valido');
            inputMonto.classList.remove('invalido');
            btnsMonto.forEach(function (b) { b.classList.remove('activo'); });
        } else {
            montoSeleccionado = 0;
            inputMonto.classList.remove('valido');
            if (inputMonto.value !== '') inputMonto.classList.add('invalido');
        }
    });
}

// Botón donar
var btnDonar = document.getElementById('btn-donar');
var alertaDonacion = document.getElementById('alerta-donacion');

if (btnDonar) {
    btnDonar.addEventListener('click', function () {
        if (montoSeleccionado < 500) {
            mostrarAlertaDonacion('❗ Seleccioná un monto o ingresá al menos ₡500.', 'error');
            return;
        }
        // Guardar donación en localStorage
        totalDonado += montoSeleccionado;
        localStorage.setItem('kiana_total_donado', totalDonado.toFixed(0));

        var historial = JSON.parse(localStorage.getItem('kiana_donaciones') || '[]');
        historial.push({
            monto: montoSeleccionado,
            fecha: new Date().toLocaleDateString('es-CR'),
            hora: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })
        });
        localStorage.setItem('kiana_donaciones', JSON.stringify(historial));

        mostrarAlertaDonacion('💚 ¡Gracias! Tu donación de ₡' + montoSeleccionado.toLocaleString('es-CR') + ' fue registrada. ¡Estás cambiando vidas!', 'exito');
        actualizarTotalDonado();

        // Resetear selección
        montoSeleccionado = 0;
        btnsMonto.forEach(function (b) { b.classList.remove('activo'); });
        if (inputMonto) { inputMonto.value = ''; inputMonto.classList.remove('valido', 'invalido'); }
    });
}

function actualizarTotalDonado() {
    var el = document.getElementById('total-donado');
    if (el) el.textContent = '₡' + parseFloat(totalDonado).toLocaleString('es-CR');
}

function mostrarAlertaDonacion(msg, tipo) {
    if (!alertaDonacion) return;
    alertaDonacion.textContent = msg;
    alertaDonacion.className = 'alerta-donacion ' + tipo;
    setTimeout(function () {
        alertaDonacion.className = 'alerta-donacion';
        alertaDonacion.textContent = '';
    }, 4000);
}


