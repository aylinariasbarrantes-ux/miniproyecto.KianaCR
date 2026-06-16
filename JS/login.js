// ============================================================
// login.js — Sistema de registro e inicio de sesión (Kiana CR)
// ============================================================

var tabLogin = document.getElementById('tab-login');
var tabRegistro = document.getElementById('tab-registro');
var panelLogin = document.getElementById('panel-login');
var panelReg = document.getElementById('panel-registro');

if (localStorage.getItem('kiana_sesion')) {
    window.location.href = 'index.html';
}

// ── Tabs ──────────────────────────────────────────────────────
tabLogin.addEventListener('click', function () {
    tabLogin.classList.add('activo');
    tabRegistro.classList.remove('activo');
    panelLogin.classList.add('activo');
    panelReg.classList.remove('activo');
    ocultarAlerta('alerta-login');
    ocultarAlerta('alerta-registro');
});

tabRegistro.addEventListener('click', function () {
    tabRegistro.classList.add('activo');
    tabLogin.classList.remove('activo');
    panelReg.classList.add('activo');
    panelLogin.classList.remove('activo');
    ocultarAlerta('alerta-login');
    ocultarAlerta('alerta-registro');
});

// ── Toggle ojo ────────────────────────────────────────────────
document.getElementById('ojo-login').addEventListener('click', function () {
    toggleOjo('login-contrasena', this);
});
document.getElementById('ojo-reg').addEventListener('click', function () {
    toggleOjo('reg-contrasena', this);
});
function toggleOjo(inputId, btn) {
    var input = document.getElementById(inputId);
    var esPass = input.type === 'password';
    input.type = esPass ? 'text' : 'password';
    btn.textContent = esPass ? '🙈' : '👁️';
}

// ── Recordar correo ───────────────────────────────────────────
var correoRecordado = localStorage.getItem('kiana_correo_recordado');
if (correoRecordado) {
    document.getElementById('login-correo').value = correoRecordado;
    document.getElementById('recordar').checked = true;
}

// ── Validación en tiempo real LOGIN ───────────────────────────
document.getElementById('login-correo').addEventListener('input', function () {
    validarCampo(this, 'err-login-correo', esCorreoValido(this.value));
});
document.getElementById('login-contrasena').addEventListener('input', function () {
    validarCampo(this, 'err-login-contrasena', this.value.length >= 6);
});

// ── Validación en tiempo real REGISTRO ───────────────────────
document.getElementById('reg-nombre').addEventListener('input', function () {
    validarCampo(this, 'err-reg-nombre', this.value.trim().length >= 3);
});
document.getElementById('reg-correo').addEventListener('input', function () {
    document.getElementById('err-reg-correo-dup').classList.remove('visible');
    validarCampo(this, 'err-reg-correo', esCorreoValido(this.value));
});
document.getElementById('reg-contrasena').addEventListener('input', function () {
    validarCampo(this, 'err-reg-contrasena', this.value.length >= 6);
    mostrarFuerzaContrasena(this.value);
    var conf = document.getElementById('reg-confirmar');
    if (conf.value) validarCampo(conf, 'err-reg-confirmar', conf.value === this.value);
});
document.getElementById('reg-confirmar').addEventListener('input', function () {
    validarCampo(this, 'err-reg-confirmar', this.value === document.getElementById('reg-contrasena').value);
});

// ── Fuerza de contraseña ──────────────────────────────────────
function mostrarFuerzaContrasena(pass) {
    var fill = document.getElementById('fuerza-fill');
    var label = document.getElementById('fuerza-label');
    var puntos = 0;
    if (pass.length >= 6) puntos++;
    if (pass.length >= 10) puntos++;
    if (/[A-Z]/.test(pass)) puntos++;
    if (/[0-9]/.test(pass)) puntos++;
    if (/[^A-Za-z0-9]/.test(pass)) puntos++;
    var colores = ['', '#ff6b8a', '#ffaa40', '#ffd740', '#b5ead7', '#7dcfb6'];
    var textos = ['', 'Muy débil', 'Débil', 'Regular', 'Fuerte', '¡Muy fuerte!'];
    fill.style.width = (puntos / 5 * 100) + '%';
    fill.style.background = colores[puntos] || '#ff6b8a';
    label.textContent = pass.length > 0 ? textos[puntos] : '';
}

// ── Enter para enviar ─────────────────────────────────────────
document.getElementById('login-contrasena').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') iniciarSesion();
});
document.getElementById('reg-confirmar').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') registrarCuenta();
});

// ── Iniciar sesión ────────────────────────────────────────────
document.getElementById('btn-login').addEventListener('click', iniciarSesion);

function iniciarSesion() {
    ocultarAlerta('alerta-login');
    var correo = document.getElementById('login-correo').value.trim();
    var contrasena = document.getElementById('login-contrasena').value;
    var v1 = validarCampo(document.getElementById('login-correo'), 'err-login-correo', esCorreoValido(correo));
    var v2 = validarCampo(document.getElementById('login-contrasena'), 'err-login-contrasena', contrasena.length >= 6);
    if (!v1 || !v2) { mostrarAlerta('alerta-login', '❗ Corregí los campos marcados.', 'error'); return; }

    var usuarios = obtenerUsuarios();
    var usuario = usuarios.find(function (u) { return u.correo === correo && u.contrasena === contrasena; });

    if (usuario) {
        localStorage.setItem('kiana_sesion', JSON.stringify({ nombre: usuario.nombre, correo: usuario.correo, hora: new Date().toISOString() }));
        if (document.getElementById('recordar').checked) {
            localStorage.setItem('kiana_correo_recordado', correo);
        } else {
            localStorage.removeItem('kiana_correo_recordado');
        }
        mostrarAlerta('alerta-login', '✅ ¡Bienvenida, ' + usuario.nombre.split(' ')[0] + '! Redirigiendo...', 'exito');
        document.getElementById('btn-login').disabled = true;
        setTimeout(function () { window.location.href = 'index.html'; }, 1400);
    } else {
        var existeCorreo = usuarios.find(function (u) { return u.correo === correo; });
        if (existeCorreo) {
            mostrarAlerta('alerta-login', '❌ Contraseña incorrecta. Intentá de nuevo.', 'error');
            document.getElementById('login-contrasena').value = '';
            document.getElementById('login-contrasena').classList.add('invalido');
        } else {
            mostrarAlerta('alerta-login', '❌ No encontramos una cuenta con ese correo. ¿Querés crear una?', 'error');
        }
    }
}

// ── Crear cuenta ──────────────────────────────────────────────
document.getElementById('btn-registrar').addEventListener('click', registrarCuenta);

function registrarCuenta() {
    ocultarAlerta('alerta-registro');
    document.getElementById('err-reg-correo-dup').classList.remove('visible');
    var nombre = document.getElementById('reg-nombre').value.trim();
    var correo = document.getElementById('reg-correo').value.trim();
    var contrasena = document.getElementById('reg-contrasena').value;
    var confirmar = document.getElementById('reg-confirmar').value;
    var v1 = validarCampo(document.getElementById('reg-nombre'), 'err-reg-nombre', nombre.length >= 3);
    var v2 = validarCampo(document.getElementById('reg-correo'), 'err-reg-correo', esCorreoValido(correo));
    var v3 = validarCampo(document.getElementById('reg-contrasena'), 'err-reg-contrasena', contrasena.length >= 6);
    var v4 = validarCampo(document.getElementById('reg-confirmar'), 'err-reg-confirmar', confirmar === contrasena);
    if (!v1 || !v2 || !v3 || !v4) { mostrarAlerta('alerta-registro', '❗ Corregí los campos marcados.', 'error'); return; }

    var usuarios = obtenerUsuarios();
    if (usuarios.find(function (u) { return u.correo === correo; })) {
        document.getElementById('err-reg-correo-dup').classList.add('visible');
        document.getElementById('reg-correo').classList.add('invalido');
        mostrarAlerta('alerta-registro', '❌ Este correo ya tiene una cuenta registrada.', 'error');
        return;
    }

    var nuevo = { id: Date.now(), nombre: nombre, correo: correo, contrasena: contrasena, fechaRegistro: new Date().toLocaleDateString('es-CR') };
    usuarios.push(nuevo);
    localStorage.setItem('kiana_usuarios', JSON.stringify(usuarios));
    localStorage.setItem('kiana_sesion', JSON.stringify({ nombre: nuevo.nombre, correo: nuevo.correo, hora: new Date().toISOString() }));

    mostrarAlerta('alerta-registro', '✅ ¡Cuenta creada! Bienvenida, ' + nombre.split(' ')[0] + '. Redirigiendo...', 'exito');
    document.getElementById('btn-registrar').disabled = true;
    setTimeout(function () { window.location.href = 'index.html'; }, 1600);
}

// ── Olvidé contraseña ─────────────────────────────────────────
document.getElementById('btn-olvide').addEventListener('click', function () {
    var correo = document.getElementById('login-correo').value.trim();
    if (!correo || !esCorreoValido(correo)) { mostrarAlerta('alerta-login', '💡 Ingresá tu correo primero.', 'error'); return; }
    var usuario = obtenerUsuarios().find(function (u) { return u.correo === correo; });
    if (usuario) {
        mostrarAlerta('alerta-login', '💡 Tu contraseña es la que elegiste al registrarte. Si no la recordás, creá una cuenta nueva.', 'exito');
    } else {
        mostrarAlerta('alerta-login', '❌ No hay cuenta con ese correo. Podés crear una nueva.', 'error');
    }
});

// ── Funciones auxiliares ──────────────────────────────────────
function obtenerUsuarios() {
    var datos = localStorage.getItem('kiana_usuarios');
    return datos ? JSON.parse(datos) : [];
}
function esCorreoValido(correo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());
}
function validarCampo(input, idError, esValido) {
    var span = document.getElementById(idError);
    if (esValido) { input.classList.remove('invalido'); input.classList.add('valido'); if (span) span.classList.remove('visible'); }
    else { input.classList.remove('valido'); input.classList.add('invalido'); if (span) span.classList.add('visible'); }
    return esValido;
}
function mostrarAlerta(id, mensaje, tipo) {
    var el = document.getElementById(id);
    el.textContent = mensaje; el.className = 'alerta-auth ' + tipo;
}
function ocultarAlerta(id) {
    var el = document.getElementById(id);
    el.className = 'alerta-auth'; el.textContent = '';
}