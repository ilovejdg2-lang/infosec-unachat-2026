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

La copia de trabajo salió de https://github.com/AlexVillegasC/infosec-unachat-2026, commit `03bb12fb30cfc8e54c47fda9682c46eab9255180`, rama `master`. Esa copia no es un fork: el remoto `origin` apunta al repositorio de Alex Villegas. No existe una rama `main` en el clon. El directorio del laboratorio no era un repositorio hasta que se copió ese historial.

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

En esta máquina se comprobó el arranque de producción: `npm ci --omit=dev` instaló 101 paquetes y `node server.js` con `PORT=3999` escribió `listening on *:3999`. La ruta `/` respondió 200 con el título del chat y el handshake de Socket.IO respondió 200. No se creó el servicio en una cuenta de Render porque esta sesión no tiene una integración autorizada ni un token de Render.

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

`RENDER_DEPLOY_HOOK_URL` es la dirección privada que Render muestra en Settings, Deploy Hook. El workflow la lee desde los secretos de Actions. No está escrita en el YAML, en este documento ni en el historial. Quien vea los registros debe ver el valor enmascarado por GitHub. En esta sesión el secreto no pudo crearse: `gh` sigue autenticado con un token inválido de `ilovejdg2-lang` y el navegador automatizado llegó a la pantalla de inicio de sesión, sin una sesión abierta.

## Ejecución de pruebas

Fecha local: 4 de noviembre de 2026. Runtime: Node.js v24.9.0 y npm 11.6.0.

| Suite | Comando | Resultado |
|---|---|---|
| Unitarias | `npm test` | 16 pruebas aprobadas, 0 fallidas |
| Integración | `npm run test:integration` | 7 pruebas aprobadas, 0 fallidas |
| Extremo a extremo | `CI=true npm run test:e2e` | 6 pruebas aprobadas, 0 fallidas |

Total local: 29 aprobadas y 0 fallidas. La prueba de extremo a extremo incluye dos contextos de navegador intercambiando un mensaje. La de integración conecta dos clientes Socket.IO, conserva el nombre `Ana` y el color `#112233`, escapa un script, acepta una imagen y un video de YouTube, y comprueba que una carga inválida no detiene el servidor.

## Verificación del despliegue

No hubo un despliegue real. No existe URL pública nueva, ni un servicio en estado Live, ni una ejecución de Actions que se pueda enlazar. Confundir el workflow escrito con un despliegue aceptado sería incorrecto.

## Resultados obtenidos

Quedó preparado el código, el blueprint de Render y el pipeline. Las pruebas locales pasan con Node.js 24 y el arranque de producción responde en el puerto indicado por el entorno. La publicación en GitHub, el secreto, el servicio de Render y las dos ejecuciones de Actions —la exitosa y la que debe omitir el despliegue— siguen pendientes de una sesión autenticada.

## Conclusiones

El chat ya puede construirse con `npm ci --omit=dev` y arrancar con `npm start` en el puerto de la plataforma. El pipeline separa la prueba del despliegue y condiciona el segundo al primero. La evidencia de producción queda incompleta hasta crear el Web Service, guardar el Deploy Hook como secreto y publicar `master` en un repositorio donde la cuenta pueda escribir.
