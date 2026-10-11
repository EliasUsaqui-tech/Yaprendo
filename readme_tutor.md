# UTEC Acompañamiento

Plataforma digital de acompañamiento académico y autoevaluación para estudiantes de primeros ciclos de UTEC.

## 🚀 Cómo correr el proyecto

### Requisitos previos

- Node.js 18+
- Docker Desktop
- Git

### 1. Clonar el repositorio

```bash
git clone https://github.com/EliasUsaqui-tech/utec-acompanamiento.git
cd utec-acompanamiento
```

### 2. Levantar MongoDB

```bash
docker run -d -p 27017:27017 --name mongo-utec mongo:7
```

### 3. Levantar el backend

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```
Servidor en `http://localhost:5000`.

### 4. Levantar el frontend

En otra terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
App en `http://localhost:5173`.

---

## 🔑 Credenciales demo

| Rol | Email | Password |
| :--- | :--- | :--- |
| Estudiante | leonardo@utec.edu.pe | leonardo123 |
| Mentor | andrea@utec.edu.pe | andrea123 |
| Admin | admin@utec.edu.pe | admin123 |

---

## 📄 Páginas de la aplicación

* **Login:** Pantalla de acceso con correo y contraseña. Valida credenciales contra el backend y guarda el token JWT en el navegador.
* **Register:** Formulario de creación de cuenta para nuevos estudiantes. Solicita nombre, correo, contraseña y ciclo académico.
* **Dashboard:** Pantalla principal tras iniciar sesión. Muestra tarjetas de acceso rápido a los módulos: Cursos, Técnicas de estudio, Mentores y Progreso.
* **Cursos:** Lista los cursos disponibles (Cálculo 1, Física 1, Fundamentos del Cálculo). Al seleccionar uno, se muestra el detalle con sus temas y autoevaluaciones disponibles.
* **Detalle del curso:** Vista del curso seleccionado. Muestra los temas que lo componen y los quizzes de autoevaluación disponibles para ese curso.
* **Autoevaluación:** Cuestionario corto por tema con opción múltiple. Al enviar las respuestas, muestra el puntaje obtenido, marca cuáles fueron correctas y entrega retroalimentación inmediata con la explicación de cada respuesta.
* **Técnicas de estudio:** Biblioteca de métodos de estudio activos (Active Recall, Repetición Espaciada, Feynman), organizados por curso y tema, con descripción y pasos concretos.
* **Mentores:** Directorio de estudiantes de ciclos superiores que ofrecen apoyo en cursos específicos. Muestra su perfil, ciclo, cursos que domina y medios de contacto.
* **Progreso:** Panel visual del avance del estudiante por curso. Muestra el porcentaje de temas dominados, en progreso y pendientes, en base a los resultados de las autoevaluaciones.
