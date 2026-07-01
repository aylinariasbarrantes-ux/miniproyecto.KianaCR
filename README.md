# Kiana CR

Plataforma de adopción responsable de mascotas en Costa Rica.  
Conecta animales rescatados con personas dispuestas a brindarles un hogar lleno de amor.  
Inspirada en "Ye'Ki be'Kiana" — "Yo te quiero" en bribri.

---

## Descripción
Kiana CR es un miniproyecto académico que busca dar solución al problema del abandono animal en Costa Rica, ofreciendo una plataforma centralizada que:
- Permite a los usuarios buscar y filtrar animales disponibles para adopción.
- Facilita la conexión con refugios y organizaciones.
- Promueve la adopción responsable y la sensibilización social.

---

## Tecnologías utilizadas
- HTML5 para la estructura de las páginas.
- CSS3 para estilos y diseño responsivo.
- JavaScript (ES6+) para la lógica de interacción.
- JSON para cargar datos de animales.
- LocalStorage para persistencia de favoritos y solicitudes.

---

## Estructura del proyecto
- `index.html` → Página de inicio con hero section, estadísticas dinámicas y explicación del problema.
- `solucion.html` → Listado dinámico de animales con búsqueda instantánea, filtros y favoritos persistentes.
- `registro.html` → Formulario con validaciones y gestión de solicitudes.
- `animales.json` → Base de datos inicial con mínimo 10 registros de animales.
- `css/` → Carpeta de estilos.
- `js/` → Carpeta de scripts.

---

## Nota importante
Para que las imágenes y las tarjetas de animales carguen correctamente, **no se debe abrir el `index.html` con doble clic**.  
El proyecto utiliza `fetch` para leer el archivo `animales.json`, lo cual requiere un servidor local.

### Opciones recomendadas:
1. Usar la extensión Live Server en Visual Studio Code.  
