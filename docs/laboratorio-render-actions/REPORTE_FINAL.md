# Reporte final

Fecha: 4 de noviembre de 2026.

| Requisito | Estado | Evidencia |
|---|---|---|
| Copia en la cuenta | COMPLETADO | https://github.com/ilovejdg2-lang/infosec-unachat-2026, rama `master`. El historial incluye el chat de Alex Villegas. GitHub no lo marca como fork |
| Servicio Render | COMPLETADO | Web Service `infosec-unachat-2026`, Node, Free, rama `master`, raíz vacía, build `npm ci --omit=dev`, start `npm start`, `NODE_VERSION=24` |
| Auto-Deploy apagado | COMPLETADO | El push de `8a6120d` no creó un despliegue. Los dos despliegues existentes son First Deploy y Deploy Hook |
| Secreto | COMPLETADO | `RENDER_DEPLOY_HOOK_URL` existe en Actions. El registro lo muestra enmascarado. El valor no está en el repositorio |
| Workflow modificado | COMPLETADO | `.github/workflows/deploy.yml`, nombre «Desplegar chat en Render». `DEPLOY` tiene `needs: test` y no usa `continue-on-error` |
| Pruebas antes del despliegue | COMPLETADO | TEST ejecuta `npm test`, `npm run test:integration` y `npm run test:e2e` con Node.js 24 |
| Ejecución exitosa y despliegue | COMPLETADO | https://github.com/ilovejdg2-lang/infosec-unachat-2026/actions/runs/41947266096. Render publicó `424bca9`, HTTP 200. La restauración posterior `af26cb2` también se publicó: https://github.com/ilovejdg2-lang/infosec-unachat-2026/actions/runs/41951404968 |
| Prueba fallida y despliegue bloqueado | COMPLETADO | https://github.com/ilovejdg2-lang/infosec-unachat-2026/actions/runs/41949557909. TEST failure, DEPLOY skipped |
| Chat público con dos ventanas | COMPLETADO | https://infosec-unachat-2026-b4a9.onrender.com. Ana y Luis se vieron con colores distintos |
| Secreto fuera del código | COMPLETADO | No hay URL de Deploy Hook en YAML, documentos ni capturas |

La prueba que falla a propósito no permanece en `master`. El commit de esta evidencia la elimina y vuelve a dejar la suite en verde.
