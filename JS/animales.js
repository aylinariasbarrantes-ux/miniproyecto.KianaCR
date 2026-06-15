// ============================================================
// animales.js — Lógica de la página de Animales (Kiana CR)
// ============================================================

// ── Variables globales ────────────────────────────────────────
var todosLosAnimales = [];   // Arreglo con todos los animales del JSON
var favoritos = [];   // Arreglo de IDs guardados en localStorage



// ── Cargar datos del JSON ─────────────────────────────────────
fetch('data/animales.json')
    .then(function (respuesta) {
        return respuesta.json();
    })
    .then(function (datos) {
        todosLosAnimales = datos;
        cargarFavoritos();
        renderizarAnimales(todosLosAnimales);
        configurarFiltros();
    })
    .catch(function (error) {
        console.error('Error cargando animales.json:', error);
        var grid = document.getElementById('animales-grid');
        grid.innerHTML = '<p style="padding:2rem;color:#888;">Error al cargar los animales. Verificá que el archivo animales.json exista.</p>';
    });

// ── Cargar favoritos desde localStorage ──────────────────────
function cargarFavoritos() {
    var datos = localStorage.getItem('kiana_favoritos');
    favoritos = datos ? JSON.parse(datos) : [];
}

// ── Guardar favoritos en localStorage ────────────────────────
function guardarFavoritos() {
    localStorage.setItem('kiana_favoritos', JSON.stringify(favoritos));
}

// ── Renderizar tarjetas de animales ──────────────────────────
function renderizarAnimales(animales) {
    var grid = document.getElementById('animales-grid');
    var estadoVacio = document.getElementById('estado-vacio');
    var contador = document.getElementById('contador');

    // Limpiar el contenido previo
    grid.innerHTML = '';

    // Mostrar estado vacío si no hay resultados
    if (animales.length === 0) {
        estadoVacio.classList.add('visible');
        contador.textContent = '0 resultados';
        return;
    }

    estadoVacio.classList.remove('visible');
    contador.textContent = animales.length + ' resultado' + (animales.length !== 1 ? 's' : '');

    // Crear tarjeta para cada animal (manipulación del DOM)
    animales.forEach(function (animal) {
        var esFavorito = favoritos.includes(animal.id);
        var claseEstado = animal.estado === 'disponible' ? 'disponible' : 'en-proceso';
        var textoEstado = animal.estado === 'disponible' ? '✅ Disponible' : '⏳ En proceso';
        var claseEspecie = 'especie-' + animal.especie;

        var card = document.createElement('article');
        card.classList.add('animal-card');
        card.setAttribute('data-id', animal.id);

        card.innerHTML =
            '<div class="animal-img-wrap">' +
            '<img src="' + animal.foto_url + '" alt="Foto de ' + animal.nombre + '" loading="lazy" ' +
            'onerror="this.src=\'https://placehold.co/400x300/FFB3C6/3D3D55?text=' + encodeURIComponent(animal.nombre) + '\'">' +
            '<span class="badge-estado ' + claseEstado + '">' + textoEstado + '</span>' +
            '<button class="btn-favorito' + (esFavorito ? ' activo' : '') + '" ' +
            'data-id="' + animal.id + '" aria-label="' + (esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos') + '">' +
            (esFavorito ? '❤️' : '🤍') +
            '</button>' +
            '</div>' +
            '<div class="animal-info">' +
            '<h3 class="animal-nombre">' + animal.nombre + '</h3>' +
            '<div class="animal-meta">' +
            '<span class="tag ' + claseEspecie + '">' + (animal.especie === 'perro' ? '🐶' : '🐱') + ' ' + capitalizarPrimera(animal.especie) + '</span>' +
            '<span class="tag">📏 ' + capitalizarPrimera(animal.tamaño) + '</span>' +
            '<span class="tag">📍 ' + animal.zona + '</span>' +
            '<span class="tag">🎂 ' + animal.edad + '</span>' +
            '</div>' +
            '<p class="animal-desc">' + animal.descripcion + '</p>' +
            '<button class="btn-interes' + (esFavorito ? ' interesado' : '') + '" data-id="' + animal.id + '" data-nombre="' + animal.nombre + '">' +
            (esFavorito ? '✅ Me interesa' : '🐾 Me interesa') +
            '</button>' +
            '</div>';

        grid.appendChild(card);
    });

    // Asignar eventos a los botones de favorito y de interés
    asignarEventosFavoritos();
}

// ── Asignar eventos a botones de favorito ────────────────────
function asignarEventosFavoritos() {
    // Botones de corazón (favorito)
    var botonesFav = document.querySelectorAll('.btn-favorito');
    botonesFav.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var id = parseInt(this.getAttribute('data-id'));
            toggleFavorito(id);
        });
    });

    // Botones de "Me interesa"
    var botonesInteres = document.querySelectorAll('.btn-interes');
    botonesInteres.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var id = parseInt(this.getAttribute('data-id'));
            toggleFavorito(id);
        });
    });
}

// ── Toggle de favorito ────────────────────────────────────────
function toggleFavorito(id) {
    var indice = favoritos.indexOf(id);

    if (indice === -1) {
        favoritos.push(id);   // Agregar favorito
    } else {
        favoritos.splice(indice, 1);  // Quitar favorito
    }

    guardarFavoritos();

    // Actualizar visual sin recargar la página (respuesta inmediata)
    var card = document.querySelector('.animal-card[data-id="' + id + '"]');
    if (!card) return;

    var esFavorito = favoritos.includes(id);
    var btnFav = card.querySelector('.btn-favorito');
    var btnInteres = card.querySelector('.btn-interes');

    if (btnFav) {
        btnFav.textContent = esFavorito ? '❤️' : '🤍';
        btnFav.setAttribute('aria-label', esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos');
        esFavorito ? btnFav.classList.add('activo') : btnFav.classList.remove('activo');
    }
    if (btnInteres) {
        btnInteres.textContent = esFavorito ? '✅ Me interesa' : '🐾 Me interesa';
        esFavorito ? btnInteres.classList.add('interesado') : btnInteres.classList.remove('interesado');
    }
}

// ── Configurar filtros y búsqueda ─────────────────────────────
function configurarFiltros() {
    var buscador = document.getElementById('buscador');
    var filtroEspecie = document.getElementById('filtro-especie');
    var filtroTamaño = document.getElementById('filtro-tamaño');
    var filtroZona = document.getElementById('filtro-zona');

    // Evento input → búsqueda instantánea mientras se escribe
    buscador.addEventListener('input', aplicarFiltros);

    // Evento change → cuando cambia cualquier filtro (select)
    filtroEspecie.addEventListener('change', aplicarFiltros);
    filtroTamaño.addEventListener('change', aplicarFiltros);
    filtroZona.addEventListener('change', aplicarFiltros);
}

// ── Aplicar filtros y búsqueda conjuntamente ──────────────────
function aplicarFiltros() {
    var textoBusqueda = document.getElementById('buscador').value.toLowerCase().trim();
    var especie = document.getElementById('filtro-especie').value;
    var tamaño = document.getElementById('filtro-tamaño').value;
    var zona = document.getElementById('filtro-zona').value;

    // Filtrar el arreglo de animales según todas las condiciones activas
    var resultado = todosLosAnimales.filter(function (animal) {
        var coincideTexto = textoBusqueda === '' ||
            animal.nombre.toLowerCase().includes(textoBusqueda) ||
            animal.zona.toLowerCase().includes(textoBusqueda) ||
            animal.descripcion.toLowerCase().includes(textoBusqueda) ||
            animal.especie.toLowerCase().includes(textoBusqueda);

        var coincideEspecie = especie === 'todos' || animal.especie === especie;
        var coincideTamaño = tamaño === 'todos' || animal.tamaño === tamaño;
        var coincideZona = zona === 'todos' || animal.zona === zona;

        // Todas las condiciones deben cumplirse (operador AND)
        return coincideTexto && coincideEspecie && coincideTamaño && coincideZona;
    });

    renderizarAnimales(resultado);
}

// ── Utilidad: capitalizar primera letra ───────────────────────
function capitalizarPrimera(texto) {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}
