# Legacy Whisperer Frontend

Frontend en React + Vite para analizar y modernizar repositorios legacy mediante un backend que expone endpoints de ingesta, análisis y descarga de artefactos.

## Qué hace

La aplicación permite iniciar un flujo de modernización desde tres fuentes:

- URL de GitHub
- Archivo `.zip`
- Ruta local del repositorio

Después de la ingesta, el frontend dispara el proceso de modernización, consulta el estado del trabajo en polling y presenta:

- resumen arquitectónico
- riesgos detectados
- plan de refactorización
- descarga del repositorio modernizado en `.zip`
- descarga del reporte en `.docx`

## Stack

- React 18
- Vite 5
- JavaScript
- CSS modular por pantalla y componente

## Requisitos

- Node.js 18+ recomendado
- npm 9+ recomendado
- Backend disponible en `http://localhost:8000`

Importante: la URL del backend está fija en [`src/api/client.js`](/Users/dannamendez1109/Documents/IBMHackathon/Frontend/src/api/client.js:1). Si el backend corre en otra dirección o puerto, hay que ajustar ese archivo.

## Instalación

```bash
npm install
```

## Ejecución

Modo desarrollo:

```bash
npm run dev
```

Build de producción:

```bash
npm run build
```

Vista previa local del build:

```bash
npm run preview
```

## Flujo de uso

1. Selecciona el modo de entrada: GitHub, `.zip` o ruta local.
2. Envía el repositorio al backend mediante la fase de ingestión.
3. El frontend llama a `POST /modernize` con el `job_id` de ingestión.
4. La app consulta `GET /status/:jobId` cada 2 segundos.
5. Cuando el backend responde con estado `completed`, se renderizan los resultados y se habilitan las descargas.

## Endpoints esperados del backend

El frontend asume la existencia de estos endpoints:

- `POST /ingest/github`
- `POST /ingest`
- `POST /ingest/local`
- `POST /modernize`
- `GET /status/:jobId`
- `GET /download/:type/:jobId`

## Estructura del proyecto

```text
src/
  api/           Cliente HTTP hacia el backend
  components/    Tablas, botones y componentes reutilizables
  hooks/         Lógica compartida como polling de jobs
  phases/        Pantallas del flujo: Upload, Analyzing, Results, Done
  App.jsx        Orquestación del flujo principal
  main.jsx       Punto de entrada
```

## Comportamiento relevante

- El frontend distingue entre el `job_id` de ingestión y el `job_id` de modernización.
- Los estados terminales esperados del backend son `completed` y `failed`.
- Los errores HTTP y timeouts se muestran mediante toasts y banner de error.
- La opción de ruta local requiere que el backend esté corriendo en la misma máquina que el frontend.

## Estado actual del proyecto

En esta carpeta existen artefactos generados localmente como `node_modules/` y `dist/`. El `.gitignore` incluido evita que vuelvan a formar parte del control de versiones.
