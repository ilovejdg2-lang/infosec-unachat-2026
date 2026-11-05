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
| Commit local del pipeline | `b886d213d254572df842bf72752f3f32be7ede30` |
| Repositorio de la cuenta | https://github.com/ilovejdg2-lang/infosec-unachat-2026 |
| Rama por defecto | `master` |
| URL pública del chat | https://infosec-unachat-2026-b4a9.onrender.com |
| URL del workflow | https://github.com/ilovejdg2-lang/infosec-unachat-2026/actions/workflows/deploy.yml |
| Ejecución con pruebas en verde | https://github.com/ilovejdg2-lang/infosec-unachat-2026/actions/runs/41944085248 |
| Cuenta GitHub | `ilovejdg2-lang` |

## Comandos ejecutados

`npm ci` instaló 505 paquetes.

`npm test`: 16 passing.

`npm run test:integration`: 1 suite, 7 tests, todas aprobadas.

`CI=true npm run test:e2e`: 6 passed (53.8s). Playwright levantó el servidor y dos páginas intercambiaron `Ana` / `hola a todos`.

En un directorio temporal, `npm ci --omit=dev` instaló 101 paquetes. El proceso escuchó en el puerto 3999, `GET /` respondió 200 y el polling de Socket.IO respondió 200. Después se cerró ese proceso.

## Estado de los trabajos

| Trabajo | Estado real |
|---|---|
| TEST en GitHub Actions | Exitoso en la ejecución 41944085248 |
| DEPLOY en esa ejecución | Falló porque el secreto todavía no existía. No llamó a Render |
| Secreto RENDER_DEPLOY_HOOK_URL | Configurado después, sin publicar su valor |
| Servicio Render | Live. Primer despliegue del commit db78a230f83c4da3c64e1b6ad6d19c704f849044. Node.js 24.22.2. Auto-deploy apagado |
| Prueba fallida que omite DEPLOY | No demostrada en Actions. El workflow lo expresa con `needs: test` y sin `continue-on-error`, pero eso no sustituye una ejecución |

## Dos clientes

La comunicación de dos clientes quedó verificada en local, no en una URL pública:

- Jest conecta dos sockets a un puerto dinámico, entrega el mismo mensaje a ambos y conserva nombre y color.
- Playwright abre dos contextos, el segundo ve el mensaje del primero, y la suite terminó en verde.

## Capturas

No hay capturas. El navegador automatizado abrió `https://github.com/login` y mostró el formulario de inicio de sesión, sin una sesión que permitiera ver el repositorio, Actions o Render. El control del escritorio de Windows no arrancó (`sidecar_unavailable`). No se generaron imágenes para simular esas pantallas.

Directorio previsto para capturas reales, cuando exista sesión: `docs/laboratorio-render-actions/evidencias/`.
