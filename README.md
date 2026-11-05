# UNA Chat

Chat Socket.IO. El inicio de sesión con Auth0 se activa solo cuando el proceso tiene `AUTH0_DOMAIN` y `AUTH0_CLIENT_ID`. Sin esas variables el chat queda abierto, que es como corren las pruebas.

## Variables

Copia `.env.example` a `.env` en esta carpeta. No subas `.env`.

| Variable | Dónde | Uso |
|---|---|---|
| `AUTH0_DOMAIN` | Servidor y navegador, vía `/auth/config` | Dominio del tenant, sin `https://` |
| `AUTH0_CLIENT_ID` | Servidor y navegador, vía `/auth/config` | Client ID público de la SPA |
| `AUTH0_CLIENT_SECRET` | Solo el servidor | No lo lee el navegador. Esta SPA no lo envía en el login |

En Render hay que definir las tres en el servicio. En GitHub no hace falta un secreto nuevo para Auth0: el despliegue ya usa `RENDER_DEPLOY_HOOK_URL`.

## Auth0

Aplicación tipo Single Page Application. En Callback URL, Logout URL y Web Origins incluye:

- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `https://infosec-unachat-2026.onrender.com`

El SDK redirige a `window.location.origin`, sin barra final. Habilita al menos un proveedor social en el tenant.

## Local

```bash
npm install
npm start
```

Abre http://localhost:3000. `npm test` y `npm run test:integration` no deben ver un `.env` con Auth0, o el chat les pedirá token.

## Despliegue

El pipeline está en `.github/workflows/deploy.yml`. Un push a `master` ejecuta las pruebas y, solo si terminan bien, pide a Render el despliegue de ese commit. El identificador viaja en el parámetro `ref` y la dirección del Deploy Hook vive en el secreto `RENDER_DEPLOY_HOOK_URL`. Un pull request ejecuta las pruebas y no despliega.

En Render el servicio es un Web Service de Node, rama `master`, plan Free, auto-deploy apagado, `NODE_VERSION=24`, compilación `npm ci --omit=dev` e inicio `npm start`. El servidor escucha `process.env.PORT`.
