// ============================================================
// sesion.js — Gestión de sesión compartida (Kiana CR)
// Incluilo en index.html, animales.html y registro.html
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

    var hamburger = document.getElementById('hamburger');
    var menu = document.getElementById('menu');
    if (hamburger && menu) {
        hamburger.addEventListener('click', function () {
            menu.classList.toggle('abierto');
        });
    }

    var sesionRaw = localStorage.getItem('kiana_sesion');
    var sesion = sesionRaw ? JSON.parse(sesionRaw) : null;
    var headerInner = document.querySelector('.header-inner');
    if (!headerInner) return;

    var hambBtn = document.getElementById('hamburger');

    if (sesion) {
        var divSesion = document.createElement('div');
        divSesion.classList.add('sesion-info');
        divSesion.innerHTML =
            '<span class="sesion-nombre">👋 ' + sesion.nombre.split(' ')[0] + '</span>' +
            '<button class="btn-cerrar-sesion" id="btn-cerrar-sesion" type="button">Salir 🚪</button>';
        headerInner.appendChild(divSesion);
        if (hambBtn) headerInner.appendChild(hambBtn);

        document.getElementById('btn-cerrar-sesion').addEventListener('click', function () {
            if (confirm('¿Querés cerrar sesión?')) {
                localStorage.removeItem('kiana_sesion');
                window.location.href = 'login.html';
            }
        });
    } else {
        var btnLogin = document.createElement('a');
        btnLogin.href = 'login.html';
        btnLogin.className = 'btn-login-nav';
        btnLogin.textContent = '🔑 Iniciar sesión';
        headerInner.appendChild(btnLogin);
        if (hambBtn) headerInner.appendChild(hambBtn);
    }
});