# Laboratorio: desplegar UNA Chat con GitHub Actions y Render

## Objetivo general

Publicar el chat UNA como un Web Service de Node.js en Render y hacer que cada cambio de `master` pase por pruebas automatizadas antes de solicitar el despliegue.

## Objetivos específicos

- Preparar el servidor para el puerto que inyecta Render.
- Conservar el chat, Socket.IO, los nombres, los colores y la validación de mensajes.
- Ejecutar las pruebas en GitHub Actions con Node.js 24.
- Solicitar el despliegue solo si las pruebas terminan bien.
- Impedir el despliegue cuando una prueba falla.
- Mantener la URL del Deploy Hook fuera del repositorio.

## Descripción del proyecto

UNA Chat es un chat en tiempo real. Express entrega `index.html` y Socket.IO reparte el evento `Evento-Mensaje-Server`. La validación vive en `libs/unalib.js`: escapa HTML, acepta imágenes y videos de YouTube válidos, y normaliza el color a un hexadecimal de seis dígitos.

El inicio de sesión con Auth0 solo se activa si existen `AUTH0_DOMAIN` y `AUTH0_CLIENT_ID`. Sin esas variables la sala queda abierta, que es el modo en el que corren las pruebas y el arranque local verificado.

La copia publicada está en https://github.com/ilovejdg2-lang/infosec-unachat-2026, rama `master`. El historial parte de https://github.com/AlexVillegasC/infosec-unachat-2026, commit `03bb12fb30cfc8e54c47fda9682c46eab9255180`. El remoto `upstream` conserva ese origen y `origin` es el repositorio de la cuenta. GitHub no lo marca como fork. No hay rama `main`.

## Tecnologías utilizadas

- Node.js 24 y npm
- Express 4
- Socket.IO 4
- Mocha y Chai para pruebas unitarias
- Jest para pruebas de integración con dos clientes
- Playwright para la interfaz
- GitHub Actions
- Render, como Web Service de Node

## Configuración de Render

| Campo | Valor |
|---|---|
| Service Type | Web Service |
| Runtime | Node |
| Branch | master |
| Root Directory | Vacío. `package.json` está en la raíz |
| Build Command | `npm ci --omit=dev` |
| Start Command | `npm start` |
| Instance Type | Free |
| NODE_VERSION | 24 |
| Auto-Deploy | Off |

El mismo contrato está en `render.yaml` (`autoDeployTrigger: off`). El servidor ya escuchaba `process.env.PORT` y conserva el puerto 3000 cuando esa variable no existe.

El servicio publicado es https://infosec-unachat-2026-b4a9.onrender.com. El primer arranque en Render usó Node.js 24.22.2. En local, `npm ci --omit=dev` instaló 101 paquetes y `PORT=3999` respondió 200 en `/` y en el handshake de Socket.IO.

## Configuración de GitHub Actions

El workflow es `.github/workflows/deploy.yml` y se llama **Desplegar chat en Render**.

- Se dispara con `push` a `master` y con `pull_request` hacia `master`.
- El permiso del token es `contents: read`.
- El trabajo `TEST` usa `actions/checkout@v5` y `actions/setup-node@v5` con Node.js 24, instala con `npm ci` y ejecuta Mocha, Jest y Playwright.
- El trabajo `DEPLOY` declara `needs: test` y solo corre en un push a `master`.
- El despliegue envía `GITHUB_SHA` en el parámetro `ref` del Deploy Hook.
- Un código HTTP fuera de 2xx hace fallar el trabajo.
- No hay `continue-on-error`.

El workflow anterior, `.github/workflows/una-chat-ci-cd.yml`, desplegaba en cada push sin pruebas y sin el SHA. Se retiró para que no hubiera dos solicitudes de despliegue y para que una prueba fallida no pudiera publicar.

## Funcionamiento del pipeline

1. Un push a `master` descarga el repositorio en un runner de Ubuntu.
2. `TEST` instala todas las dependencias, incluidas las de desarrollo, y ejecuta las tres suites.
3. Si alguna prueba falla, `DEPLOY` queda omitido y Render no recibe la solicitud.
4. Si `TEST` termina bien, `DEPLOY` comprueba que el secreto exista y hace `POST` al Deploy Hook con `ref` igual al commit validado.
5. Un pull request ejecuta `TEST` y no ejecuta `DEPLOY`.

## Explicación del secreto

`RENDER_DEPLOY_HOOK_URL` es la dirección privada que Render muestra en Settings, Deploy Hook. El workflow la lee desde los secretos de Actions. No está escrita en el YAML, en este documento ni en el historial. En el registro de la ejecución exitosa GitHub muestra el valor como `***` y el paso imprimió `Respuesta HTTP: 200`.

## Ejecución de pruebas

Fecha local: 4 de noviembre de 2026. Runtime: Node.js v24.9.0 y npm 11.6.0.

| Suite | Comando | Resultado |
|---|---|---|
| Unitarias | `npm test` | 16 pruebas aprobadas, 0 fallidas |
| Integración | `npm run test:integration` | 7 pruebas aprobadas, 0 fallidas |
| Extremo a extremo | `CI=true npm run test:e2e` | 6 pruebas aprobadas, 0 fallidas |

Total local: 29 aprobadas y 0 fallidas. La prueba de extremo a extremo incluye dos contextos de navegador intercambiando un mensaje. La de integración conecta dos clientes Socket.IO, conserva el nombre `Ana` y el color `#112233`, escapa un script, acepta una imagen y un video de YouTube, y comprueba que una carga inválida no detiene el servidor.

## Verificación del despliegue

El chat público es https://infosec-unachat-2026-b4a9.onrender.com. La ejecución con pruebas en verde y despliegue aceptado es https://github.com/ilovejdg2-lang/infosec-unachat-2026/actions/runs/41947266096. Render quedó Live en el commit `424bca9`.

La ejecución con una prueba rota es https://github.com/ilovejdg2-lang/infosec-unachat-2026/actions/runs/41949557909. TEST falló y DEPLOY quedó en skipped. Ese commit no aparece entre los despliegues de Render.

Dos ventanas de la URL pública intercambiaron mensajes con los nombres Ana y Luis y colores distintos. El detalle está en `EVIDENCIAS.md`.

## Resultados obtenidos

El servicio está Live, el secreto está guardado fuera del código y el workflow publica solo después de las pruebas. Una falla real de Mocha impidió la solicitud a Render. La prueba temporal no se deja en `master`.

## Conclusiones

El chat se construye con `npm ci --omit=dev` y arranca con `npm start` en el puerto de la plataforma. El pipeline separa la prueba del despliegue: `needs: test` omite DEPLOY cuando TEST falla, y un pull request no despliega.
