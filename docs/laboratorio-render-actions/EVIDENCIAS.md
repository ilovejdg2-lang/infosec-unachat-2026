# Evidencias

Fecha: 4 de noviembre de 2026, hora de Costa Rica.

## Entrega

| Dato | Valor |
|---|---|
| Repositorio | https://github.com/ilovejdg2-lang/infosec-unachat-2026 |
| Rama | `master` |
| Chat público | https://infosec-unachat-2026-b4a9.onrender.com |
| Workflow modificado | https://github.com/ilovejdg2-lang/infosec-unachat-2026/actions/workflows/deploy.yml |
| Pruebas exitosas y despliegue | https://github.com/ilovejdg2-lang/infosec-unachat-2026/actions/runs/41947266096 |
| Prueba fallida y despliegue bloqueado | https://github.com/ilovejdg2-lang/infosec-unachat-2026/actions/runs/41949557909 |
| Cuenta | `ilovejdg2-lang` |

El historial parte de https://github.com/AlexVillegasC/infosec-unachat-2026, commit `03bb12fb30cfc8e54c47fda9682c46eab9255180`. El remoto `upstream` apunta ahí. `origin` es el repositorio de la cuenta. GitHub no lo muestra como fork.

## Ejecución con pruebas exitosas

Run `41947266096`, commit `424bca9d2994f741410d82ecf6188e33cc7e4984`.

- TEST: success
- DEPLOY: success
- El paso de despliegue escribió `Respuesta HTTP: 200` y `Commit enviado: 424bca9d2994f741410d82ecf6188e33cc7e4984`
- Render quedó Live en `424bca9`, disparado por Deploy Hook, duración 37.7 s

La ejecución anterior, `41944085248`, tuvo TEST en verde y DEPLOY en rojo porque el secreto todavía no existía. No es la evidencia de despliegue.

## Ejecución con prueba fallida

Run `41949557909`, commit `8a6120d9dcfa555dbf8d30ff0d50e4786639e8e2`.

- TEST: failure
- DEPLOY: skipped
- Mocha reportó 16 pruebas aprobadas y 1 fallida: `pipeline block demonstration` / `fails on purpose so the deploy job is skipped`
- Render sigue con dos despliegues: el inicial `db78a23` y el Deploy Hook de `424bca9`. No hay despliegue de `8a6120d`

El archivo `test/pipeline-block.test.js` se retira en el commit que guarda esta evidencia, para que `master` no conserve el fallo.

## Dos ventanas del chat público

La URL pública respondió `{"enabled":false}` en `/auth/config`, así que la sala no pidió Auth0.

Dos pestañas independientes intercambiaron mensajes:

- Ana, color `#5231DC`: «Hola desde la ventana de Ana» y «Ana escribe para Luis»
- Luis, color `#E37141`: «Luis responde en la otra ventana»

La ventana de Ana recibió la respuesta de Luis. La ventana de Luis recibió «Ana escribe para Luis», el mensaje enviado después de que esa pestaña se conectó. Cada mensaje apareció una vez. No hubo aviso de desconexión.

Capturas: `evidencias/ventana-ana.png`, `evidencias/ventana-luis.png`, `evidencias/render-live.png`, `evidencias/render-deploys.png`.

## Pruebas locales previas

Node.js v24.9.0. Mocha 16/16, Jest 7/7 y Playwright 6/6, el 4 de noviembre de 2026, antes de agregar la prueba temporal.
