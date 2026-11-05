# Evidencias

Fecha de las pruebas locales: 4 de noviembre de 2026.

## Enlaces

| Dato | Valor real |
|---|---|
| Repositorio de origen | https://github.com/AlexVillegasC/infosec-unachat-2026 |
| Propietario del origen | Alex Villegas (`AlexVillegasC`) |
| ¿La copia local es un fork? | No. `origin` apunta a ese repositorio |
| Rama observada | `master` |
| Rama `main` en el clon | No |
| Commit de origen | `03bb12fb30cfc8e54c47fda9682c46eab9255180` |
| URL pública del chat desplegado en esta entrega | No existe. No se creó ni se verificó un servicio |
| URL del workflow en GitHub | No publicada. El archivo local es `.github/workflows/deploy.yml` |
| Ejecución exitosa | No hubo una ejecución en GitHub Actions |
| Ejecución fallida | No hubo una ejecución en GitHub Actions |
| Cuenta GitHub detectada | `ilovejdg2-lang` |
| Repositorio del estudiante para este chat | No existe uno público. `lab6-paradigma` es otro proyecto y no se modificó |

## Comandos ejecutados

`npm ci` instaló 505 paquetes.

`npm test`: 16 passing.

`npm run test:integration`: 1 suite, 7 tests, todas aprobadas.

`CI=true npm run test:e2e`: 6 passed (53.8s). Playwright levantó el servidor y dos páginas intercambiaron `Ana` / `hola a todos`.

En un directorio temporal, `npm ci --omit=dev` instaló 101 paquetes. El proceso escuchó en el puerto 3999, `GET /` respondió 200 y el polling de Socket.IO respondió 200. Después se cerró ese proceso.

## Estado de los trabajos

| Trabajo | Estado real |
|---|---|
| TEST en GitHub Actions | No ejecutado |
| DEPLOY en GitHub Actions | No ejecutado |
| Deploy Hook | No llamado. No hay URL y no se inventó una |
| Servicio Render | No creado en esta sesión |
| Prueba fallida que omite DEPLOY | No demostrada en Actions. El workflow lo expresa con `needs: test` y sin `continue-on-error`, pero eso no sustituye una ejecución |

## Dos clientes

La comunicación de dos clientes quedó verificada en local, no en una URL pública:

- Jest conecta dos sockets a un puerto dinámico, entrega el mismo mensaje a ambos y conserva nombre y color.
- Playwright abre dos contextos, el segundo ve el mensaje del primero, y la suite terminó en verde.

## Capturas

No hay capturas. El navegador automatizado abrió `https://github.com/login` y mostró el formulario de inicio de sesión, sin una sesión que permitiera ver el repositorio, Actions o Render. El control del escritorio de Windows no arrancó (`sidecar_unavailable`). No se generaron imágenes para simular esas pantallas.

Directorio previsto para capturas reales, cuando exista sesión: `docs/laboratorio-render-actions/evidencias/`.
