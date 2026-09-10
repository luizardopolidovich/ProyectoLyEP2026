# Analisis Tecnico - Panel de Control de Clientes

## Resumen ejecutivo

El proyecto es un frontend hecho con React y Vite que simula un panel de gestion de clientes, usando la API publica FakeStoreAPI como si fuera el backend. El login es local, con una lista de usuarios hardcodeada en el codigo y la sesion guardada en localStorage. La organizacion de carpetas esta bien pensada (components, pages, services, hooks, context, routes) y las rutas protegidas andan bien. El problema es que tiene varios puntos debiles: se pueden ver contraseñas en texto plano en dos lugares distintos, el estado de "quien esta logueado" se maneja de dos formas distintas que no se sincronizan entre si, hay llamadas a la API duplicadas en vez de usar los servicios que ya existen, y no hay ni un solo test. Es un prototipo que funciona para la entrega de la materia, pero no para produccion tal como esta.Vale aclarar que, a pesar de que la consigna general menciona React, Node.js y Express, este prototipo especifico no tiene backend propio: todo el consumo de datos se hace contra la API publica FakeStoreAPI.

## Tabla de hallazgos

| # | Problema detectado | Dimension | Impacto | Propuesta de solucion |
|---|---|---|---|---|
| 1 | Las contraseñas de los usuarios estan escritas directamente en el codigo (`src/services/autorizacionesServices.js`) | Seguridad | Alto | Sacarlas del codigo, usar variables de entorno o un backend real de autenticacion |
| 2 | La ficha de cliente muestra la contraseña del cliente en texto plano en pantalla | Seguridad | Alto | Sacar ese campo de la vista |
| 3 | El rol del usuario se guarda en dos lados distintos (`localStorage("role")` y el `admin` del Context), y al cerrar sesion solo se borra uno | Arquitectura | Medio | Usar solo el Context como fuente de la verdad |
| 4 | `ListaClientes.jsx` y `DetalleCliente.jsx` usan `fetch` directo en vez de la capa de servicios que ya esta armada | Arquitectura / duplicacion | Medio | Centralizar todas las llamadas a la API en `clientesService.js` |
| 5 | Si falla el borrado de un cliente (respuesta no ok), no se muestra ningun mensaje de error | Calidad de codigo | Medio | Agregar el mensaje de error tambien en ese caso |
| 6 | Al crear un cliente nuevo, se le pone siempre la misma contraseña fija (`"1234"`) | Seguridad | Medio | Generar una contraseña aleatoria, o sacar el campo si no hace falta |
| 7 | El Dashboard muestra numeros fijos ("10", "3", "3") en vez de calcularlos con datos reales | UX / Datos | Bajo-Medio | Calcular las estadisticas a partir de lo que devuelve la API |
| 8 | La URL de la API esta repetida como texto suelto en tres archivos distintos | Mantenibilidad | Bajo | Ponerla en un solo lugar (constante o `.env`) |
| 9 | No hay ningun test, ni configuracion de un framework para testear | Testing | Medio | Sumar Vitest + React Testing Library con al menos tests basicos |
| 10 | Los inputs del login no tienen `id`/`htmlFor` conectando el label con el input | Accesibilidad | Bajo | Agregar esos atributos |
| 11 | No hay manejo global de errores si algo se rompe al renderizar; solo existe la pagina de 404 | Robustez | Bajo | Agregar un Error Boundary |
| 12 | Ningun componente valida sus props (no hay PropTypes ni TypeScript) | Buenas practicas | Bajo | Agregar PropTypes o evaluar migrar a TypeScript de a poco |

## Mejora seleccionada - justificacion

### Luis Vilca - Hallazgo #2 (contraseña expuesta en la ficha de cliente)

Implemente el hallazgo #2: sacar la contraseña del cliente de la vista de ficha (DetalleCliente.jsx).

Lo elegi por dos razones. Primero, es el de mas impacto real: cualquier usuario logueado, sin importar su rol podia ver la contraseña de cualquier cliente con solo entrar a su ficha. Segundo, era el mas seguro de tocar sin romper nada mas: el cambio queda en un solo archivo, no toca logica de negocio ni depende de arreglar otros hallazgos primero (a diferencia del #3 o el #4, que necesitan tocar varios archivos). Los hallazgos #1 y #6 son igual de importantes en seguridad, pero implican decisiones de arquitectura (como manejar credenciales reales) que no entran en el alcance de esta entrega.

**Como lo probe:** verifique manualmente que la ficha de cliente sigue mostrando el resto de los datos sin errores, y que la contraseña ya no aparece en pantalla. El resto de la funcionalidad (datos personales, direccion, boton "Eliminar Cliente" para el rol Gerencia) sigue andando igual que antes.



### Agustín Parraga - Hallazgo #10 (accesibilidad básica del formulario de login)

Implementé el hallazgo #10: agregar accesibilidad básica al formulario de inicio de sesión (Login.jsx).

Lo elegí por tres razones. Primero, aunque en la tabla figura con impacto Bajo, el login es la puerta de entrada al sistema: para una persona que usa teclado o lector de pantalla, no poder completarlo significa no poder usar ninguna otra funcionalidad. Segundo, era seguro de tocar sin romper nada: el cambio queda en un solo archivo, no modifica la lógica de autenticación y no se superpone con las mejoras de mis compañeros. Tercero, el resultado se puede verificar de forma objetiva: el contraste de los mensajes de error pasa de 4,00:1 a 5,01:1 y cumple el mínimo de 4,5:1 que pide la norma WCAG AA. Los hallazgos #1 y #3 tienen más impacto, pero el #1 requiere un backend de autenticación y el #3 obliga a modificar varios archivos a la vez, lo que excede el alcance de esta entrega.

Cómo lo probé: verifiqué manualmente en el navegador que al hacer clic en cada etiqueta se enfoca su campo; que al enviar el formulario vacío aparecen los tres mensajes de error y el foco queda en Email; que al completar el email y volver a enviar, el foco pasa a Contraseña y después a Sector; y que los mensajes se ven con el rojo de login.css. El inicio de sesión con un usuario válido (jimena@gmail.com, sector Gerencia) sigue entrando al Dashboard igual que antes.



## Backlog priorizado (para proximas iteraciones)

1. Sacar las contraseñas hardcodeadas del codigo (#1) - Alto
2. ~~Sacar la contraseña en texto plano de la ficha de cliente (#2)~~ - hecho en este PR
3. Unificar `role` y `admin` en una sola fuente de verdad (#3) - Medio
4. Centralizar las llamadas a la API en `clientesService.js` (#4) - Medio
5. Mostrar error cuando falla el borrado de un cliente (#5) - Medio
6. Generar contraseña aleatoria al crear un cliente (#6) - Medio
7. Agregar tests con Vitest + React Testing Library (#9) - Medio
8. Centralizar la URL de la API en variables de entorno (#8) - Bajo
9. Calcular las metricas del Dashboard con datos reales (#7) - Bajo
10. ~~Agregar accesibilidad basica al formulario de login (#10)~~ - hecho en el PR de Agustín Parraga
11. Agregar un Error Boundary global (#11) - Bajo
12. Agregar PropTypes o evaluar TypeScript (#12) - Bajo



