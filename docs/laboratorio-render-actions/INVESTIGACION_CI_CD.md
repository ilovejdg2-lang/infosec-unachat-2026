# Investigación: CI, CD, GitHub Actions y Render

Las definiciones siguientes se apoyan en la documentación oficial de GitHub Actions y de Render.

Referencias:

- https://docs.github.com/en/actions/concepts/overview
- https://docs.github.com/en/actions/concepts/workflows-and-actions/workflows
- https://docs.github.com/en/actions/concepts/workflows-and-actions/variables
- https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions
- https://render.com/docs/deploys
- https://render.com/docs/deploy-hooks
- https://render.com/docs/free
- https://render.com/docs/blueprint-spec

## 1. ¿Qué es CI?

CI es integración continua. Cada cambio se integra en la rama compartida y se comprueba de forma automática: instalación, pruebas y otras verificaciones. El objetivo es descubrir un fallo cerca del commit que lo introdujo, antes de que llegue a quienes usan el sistema.

En este laboratorio, CI es el trabajo `TEST`: instala con `npm ci` y ejecuta las suites del chat.

## 2. ¿Qué es CD?

CD es entrega continua o despliegue continuo. La entrega continua deja una versión construida y lista para publicarse. El despliegue continuo la publica sin un paso manual adicional. Aquí el trabajo `DEPLOY` pide a Render que publique el commit que ya pasó las pruebas. Como el auto-deploy de Render debe quedar apagado, la publicación la dispara el workflow y no cada push por su cuenta.

## 3. ¿Cómo funciona GitHub Actions?

GitHub Actions ejecuta automatizaciones definidas en el repositorio. Un evento —en este caso un push o un pull request— pone en marcha un workflow. GitHub asigna una máquina virtual, el runner, y esa máquina ejecuta los pasos. El resultado queda en la pestaña Actions, con registros por trabajo y por paso.

## 4. ¿Qué es un workflow?

Un workflow es el archivo YAML de `.github/workflows/`. Describe el nombre visible, el evento que lo dispara, los permisos y los trabajos. `deploy.yml` se llama «Desplegar chat en Render».

## 5. ¿Qué son los jobs?

Un job es un grupo de pasos que corre en el mismo runner. Los jobs de un workflow pueden correr en paralelo o encadenarse. `test` y `deploy` son dos jobs. `deploy` declara `needs: test`, así que espera a que el otro termine con éxito. Si `test` falla, GitHub omite `deploy`.

## 6. ¿Qué son los steps?

Un step es una tarea dentro de un job: usar una acción (`actions/checkout@v5`, `actions/setup-node@v5`) o ejecutar un comando de shell (`npm test`, `curl`). Los steps de un mismo job comparten el sistema de archivos. Un step que termina con error detiene el job, salvo que se pida lo contrario. Este pipeline no pide lo contrario.

## 7. ¿Qué es un runner?

Un runner es la máquina que ejecuta el job. `ubuntu-latest` es un runner hospedado por GitHub: se crea para el job y se destruye al terminar. No es el servidor de Render. El runner prueba el código; Render es quien lo sirve a los usuarios.

## 8. ¿Qué es un Deploy Hook?

Es una URL secreta del servicio, en Settings → Deploy Hook. Un `GET` o un `POST` a esa URL pide un despliegue. Render documenta el parámetro `ref` para elegir el commit. La respuesta es 200 si acepta el SHA y 404 si ese commit no está en el repositorio vinculado. Por eso el servicio tiene que estar conectado al mismo repositorio que produce `GITHUB_SHA`. Usar `ref` también deja el auto-deploy desactivado, que es lo que pide el laboratorio.

## 9. ¿Qué es GITHUB_SHA?

Es la variable que GitHub define en el runner con el SHA completo del commit que disparó el workflow. En un push es el commit que se acaba de publicar. El trabajo `DEPLOY` lo manda como `ref` para que Render construya ese commit y no otro más nuevo que hubiera entrado después.

## 10. ¿Para qué sirven los secrets?

Los secrets son valores cifrados que GitHub inyecta en el runner y enmascara en los registros. Sirven para tokens, llaves y, en este caso, la URL del Deploy Hook. El código referencia `${{ secrets.RENDER_DEPLOY_HOOK_URL }}`. El valor no debe aparecer en YAML, commits, documentación ni capturas. Si el secreto falta, el workflow debe fallar antes de llamar a Render.

## 11. ¿Por qué deben ejecutarse las pruebas antes del despliegue?

Porque un push puede compilar y, aun así, romper el chat: un mensaje que no llega, un nombre que se pierde o un script que no se escapa. Probar primero responde si esta versión conserva el contrato. Publicar primero y probar después deja a los usuarios en la versión rota mientras alguien se entera.

## 12. ¿Cómo se impide que una aplicación defectuosa llegue a producción?

Con una dependencia real entre trabajos. `deploy` tiene `needs: test` y no tiene `continue-on-error`. GitHub no inicia un job cuyo job requerido falló: lo marca como skipped. Además, `deploy` solo corre cuando el evento es un push a `master`, así que un pull request puede fallar o pasar sin publicar. Render, con el auto-deploy apagado, no publica por su cuenta ese mismo push.

## 13. ¿Qué limitaciones tiene Render Free?

Según la documentación de Render Free, un Web Service gratuito se suspende tras un periodo sin tráfico y vuelve a arrancar en la siguiente visita, así que la primera carga después de la pausa tarda más. El plan tiene un cupo mensual de horas de instancia y no ofrece el mismo disco persistente, el mismo rendimiento ni las mismas opciones de escala que un plan de pago. El chat guarda los mensajes solo en memoria: un reinicio o una suspensión vacía la sala. Esas limitaciones no cambian el comando de build ni el de start de este laboratorio.

## 14. ¿Cómo podría mejorarse el pipeline en el futuro?

- Esperar a que el despliegue de Render termine y publicar su estado, en vez de conformarse con el HTTP 200 del hook.
- Añadir un entorno de previsualización para pull requests, separado de producción.
- Fijar las acciones oficiales a un SHA, además de la versión mayor, para reducir el riesgo de una etiqueta que se mueva.
- Publicar el informe de pruebas como artefacto.
- Avisar cuando el servicio gratuito quede dormido o el deploy falle después de que el hook haya respondido.
- Revisar con regularidad `npm audit` sin mezclar esa actualización con el comportamiento del chat.
