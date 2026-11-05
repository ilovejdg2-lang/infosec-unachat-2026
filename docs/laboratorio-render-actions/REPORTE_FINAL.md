# Reporte final

Fecha: 4 de noviembre de 2026.

Los estados usan solo la escala pedida. Nada se marca como completado sin una comprobación hecha en esta sesión.

| Requisito | Estado | Evidencia | Observación |
|---|---|---|---|
| Repositorio preparado | COMPLETADO | `server.js` usa `process.env.PORT`. `npm start` existe. `npm ci --omit=dev` instaló 101 paquetes y el proceso escuchó en el puerto 3999. `GET /` y el handshake de Socket.IO respondieron 200 | La copia parte de `AlexVillegasC/infosec-unachat-2026` en `03bb12fb30cfc8e54c47fda9682c46eab9255180` |
| Rama master | COMPLETADO | `git status` muestra `master...origin/master`. El `HEAD` remoto del origen es `refs/heads/master` | No hay rama `main` en el clon |
| Servicio Render creado | BLOQUEADO | No hay CLI de Render, ni variable de cuenta, ni sesión del panel | `render.yaml` describe el servicio, pero no lo crea |
| Node.js 24 | COMPLETADO | Node local v24.9.0. `.node-version` contiene 24. `engines` pide `>=24`. El workflow fija `node-version: 24`. Las 29 pruebas pasaron en ese runtime | Falta aplicar `NODE_VERSION` dentro de un servicio real |
| Auto-Deploy desactivado | BLOQUEADO | `render.yaml` declara `autoDeployTrigger: off` | No se pudo comprobar el interruptor en el panel |
| Deploy Hook configurado | BLOQUEADO | No se abrió Settings → Deploy Hook | No se inventó una URL |
| Secreto de GitHub | BLOQUEADO | `gh auth status` responde que el token de `ilovejdg2-lang` es inválido | El workflow ya lee `secrets.RENDER_DEPLOY_HOOK_URL` sin escribir el valor |
| Workflow creado | COMPLETADO | `.github/workflows/deploy.yml`, nombre «Desplegar chat en Render», permiso `contents: read` | GitHub todavía no lo ha indexado porque no se pudo publicar |
| Pruebas automatizadas | COMPLETADO | Mocha 16/16, Jest 7/7, Playwright 6/6, el 4 de noviembre de 2026 | Cubren arranque, dos clientes, nombre, color, validación, imagen, YouTube y una carga inválida |
| Pipeline CI/CD | COMPLETADO | `deploy` tiene `needs: test`, no usa `continue-on-error` y su `if` exige push a `master` | La estructura está en el archivo. Falta verla correr |
| Ejecución exitosa | BLOQUEADO | No hay un run id de Actions | Hace falta push a un `master` con permiso de escritura |
| Ejecución fallida | BLOQUEADO | No se publicó una prueba rota temporal | No se dejó ninguna prueba fallando en el árbol |
| Despliegue bloqueado | BLOQUEADO | No existe una ejecución con TEST en rojo y DEPLOY en skipped | El YAML lo pide; la demostración en Actions no ocurrió |
| Aplicación Live | BLOQUEADO | No hay URL pública de esta entrega | El arranque local de producción sí respondió |
| Dos clientes comunicándose | PENDIENTE DE VERIFICACIÓN | Jest y Playwright probaron dos clientes contra el servidor local | Falta repetirlo en la URL pública de Render |

## Lectura de la matriz

El código, las pruebas locales y el contrato del pipeline están hechos. La publicación, el servicio Live, el secreto y las dos corridas de Actions no tienen evidencia y por eso no se declaran completas. El criterio de cierre del laboratorio —chat público, workflow activo, corrida verde, corrida roja que no despliega y dos usuarios en la URL pública— sigue abierto.
