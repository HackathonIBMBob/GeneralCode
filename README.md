# Legacy Whisperer

Legacy Whisperer es una aplicación para analizar repositorios legacy, proponer una modernización asistida con IBM watsonx y entregar artefactos listos para descargar.

El repositorio está organizado como un monorepo simple con:

- `Backend/`: API en FastAPI que ingiere repositorios, ejecuta el pipeline y genera resultados.
- `Frontend/`: interfaz en React + Vite para subir el repo, seguir el progreso y descargar artefactos.
- `TEST/legacy-sample-app/`: aplicación Java legacy de ejemplo para pruebas.

## Flujo general

1. El usuario sube un `.zip`, una URL pública de GitHub o una ruta local.
2. El backend crea un `job`, analiza el repositorio y ejecuta la modernización.
3. El frontend consulta el estado del proceso por polling.
4. Al finalizar, se puede descargar un `.zip` con el código modernizado y, si se genera, un `report.docx`.

## Requisitos

- Python 3.10+
- Node.js 18+
- npm 9+
- `git` instalado
- Credenciales de IBM watsonx para ejecutar el backend completo

## Ejecutar el backend

```bash
cd Backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```

Variables mínimas en `Backend/.env`:

```env
WATSONX_URL=https://us-south.ml.cloud.ibm.com
WATSONX_APIKEY=tu_api_key
WATSONX_PROJECT_ID=tu_project_id
```

Backend local:

- API: `http://127.0.0.1:8000`
- Swagger: `http://127.0.0.1:8000/docs`

## Ejecutar el frontend

```bash
cd Frontend
npm install
npm run dev
```

Frontend local:

- App: `http://localhost:5173`

Nota: el frontend espera el backend en `http://localhost:8000`. Si cambias esa dirección, ajusta `Frontend/src/api/client.js`.

## Uso rápido

1. Levanta el backend.
2. Levanta el frontend.
3. Abre `http://localhost:5173`.
4. Ingresa un repo por GitHub, `.zip` o ruta local.
5. Espera a que el job termine.
6. Descarga los resultados.

## Proyecto de prueba

`TEST/legacy-sample-app/` contiene una app Java 8 legacy de ejemplo para probar la ingestión y modernización.

Build:

```bash
cd TEST/legacy-sample-app
mvn clean package
```

## Estructura

```text
IBMHackathon/
├── Backend/
├── Frontend/
├── TEST/
│   └── legacy-sample-app/
├── .gitignore
└── README.md
```

## Notas

- Los `.env` no se suben al repositorio; `*.example` sí.
- El estado de los jobs se mantiene en memoria del backend.
- La ingestión desde GitHub está pensada para repos públicos.
- La generación de `report.docx` es opcional y no bloquea el pipeline principal si falla.
