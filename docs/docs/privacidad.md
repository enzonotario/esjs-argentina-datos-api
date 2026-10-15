---
title: 'Privacidad'
description: 'Aviso sobre los datos de conexión de la API y los sitios de ArgentinaDatos: qué hay, para qué, quién los trata y por cuánto tiempo.'
aside: false
outline: false
sidebar: false
prev: false
next: false
---

# Privacidad

**Actualización:** 14 de octubre de 2026.

## Qué es esta página

Este aviso cubre la API en `https://api.argentinadatos.com` y estos sitios:

- [argentinadatos.com](https://argentinadatos.com)
- [diputados.argentinadatos.com](https://diputados.argentinadatos.com)
- [senadores.argentinadatos.com](https://senadores.argentinadatos.com)
- [app.argentinadatos.com](https://app.argentinadatos.com)

## Quién es responsable

El responsable del tratamiento es el proyecto ArgentinaDatos.

El contacto es [hi@enzonotario.me](mailto:hi@enzonotario.me).

## Qué datos hay

La API no pide cuenta, nombre ni correo.

Lo que queda de una consulta es un dato de conexión: dirección IP, fecha, ruta, código HTTP, User-Agent y el referrer, si el cliente lo envía. La aplicación de la API no guarda ese dato en una base de usuarios y no pone cookies.

Los sitios, además, miden visitas. Esa medición usa una cookie.

## Para qué

Esos datos sirven para entregar la respuesta, para la seguridad del servicio y para estadísticas de tráfico con las que se opera el servicio.

No hay publicidad. No hay un perfil de usuario de la API.

## Quién más los trata

Estos servicios también tratan datos de conexión. Pueden tratarlos fuera de Argentina.

- **Cloudflare** actúa como proxy y como protección del servicio. Ve la IP para entregar el pedido y para la seguridad. ArgentinaDatos no copia esos registros a una base propia.
- **El servidor de origen** guarda un access log, que rota, y estadísticas de tráfico. La IP completa entra en el conteo de direcciones frecuentes. No entra en el conteo de visitantes únicos. El proveedor de la máquina puede guardar registros de red propios, según su política. Esos registros no se usan para analítica ni para identificar a una persona.
- **Google Analytics** mide visitas en los sitios. [Google Analytics 4 usa la IP para una ubicación aproximada y no la guarda en los informes](https://support.google.com/analytics/answer/11598602?hl=en).
- **Algolia** solo interviene en la búsqueda de esta documentación. Una consulta a la API no pasa por Algolia. La política de Algolia está en [algolia.com/policies/privacy](https://www.algolia.com/policies/privacy).

## Cuánto tiempo

- El access log permanece hasta que rota el archivo.
- Las estadísticas por hora se conservan 30 días.
- Las estadísticas por día se conservan 395 días.
- Cloudflare conserva sus registros según su [política de privacidad](https://www.cloudflare.com/privacypolicy/).

No prometemos un borrado manual de cada log de infraestructura.

## Qué no hacemos

- No vendemos datos de conexión.
- No los usamos para anuncios de la API.
- No los cruzamos con otras bases para identificar a quien consulta.

## Derechos

La [Ley 25.326](https://www.argentina.gob.ar/normativa/nacional/ley-25326-64790) reconoce los derechos de acceso, rectificación, actualización y supresión. El pedido se hace por correo a [hi@enzonotario.me](mailto:hi@enzonotario.me).

La autoridad de control es la [Agencia de Acceso a la Información Pública (AAIP)](https://www.argentina.gob.ar/aaip).

Si un dato está solo en un proveedor, se gestiona con lo que el proyecto controla.

## Cambios

Este aviso se puede actualizar. Vale la fecha de arriba.
