Analisis Tecnico — Panel de Control de Clientes
Resumen ejecutivo

El proyecto es un frontend hecho con React y Vite que simula un panel de gestion de clientes, usando la API publica FakeStoreAPI como si fuera el backend. El login es local, con una lista de usuarios hardcodeada en el codigo y la sesion guardada en localStorage. La organizacion de carpetas esta bien pensada (components, pages, services, hooks, context, routes) y las rutas protegidas andan bien. El problema es que tiene varios puntos debiles: se pueden ver contraseñas en texto plano en dos lugares distintos, el estado de "quien esta logueado" se maneja de dos formas distintas que no se sincronizan entre si, hay llamadas a la API duplicadas en vez de usar los servicios que ya existen, y no hay ni un solo test. Es un prototipo que funciona para la entrega de la materia, pero no para produccion tal como esta.

Tabla de hallazgos
#	Problema detectado	Dimension	Impacto	Propuesta de solucion
1	Las contraseñas de los usuarios estan escritas directamente en el codigo (src/services/autorizacionesServices.js)	Seguridad	Alto	Sacarlas del codigo, usar variables de entorno o un backend real de autenticacion
2	La ficha de cliente muestra la contraseña del cliente en texto plano en pantalla	Seguridad	Alto	Sacar ese campo de la vista
3	El rol del usuario se guarda en dos lados distintos (localStorage("role") y el admin del Context), y al cerrar sesion solo se borra uno	Arquitectura	Medio	Usar solo el Context como fuente de la verdad
4	ListaClientes.jsx y DetalleCliente.jsx usan fetch directo en vez de la capa de servicios que ya esta armada	Arquitectura / duplicacion	Medio	Centralizar todas las llamadas a la API en clientesService.js
5	Si falla el borrado de un cliente (respuesta no ok), no se muestra ningun mensaje de error	Calidad de codigo	Medio	Agregar el mensaje de error tambien en ese caso
6	Al crear un cliente nuevo, se le pone siempre la misma contraseña fija ("1234")	Seguridad	Medio	Generar una contraseña aleatoria, o sacar el campo si no hace falta
7	El Dashboard muestra numeros fijos ("10", "3", "3") en vez de calcularlos con datos reales	UX / Datos	Bajo-Medio	Calcular las estadisticas a partir de lo que devuelve la API
8	La URL de la API esta repetida como texto suelto en tres archivos distintos	Mantenibilidad	Bajo	Ponerla en un solo lugar (constante o .env)
9	No hay ningun test, ni configuracion de un framework para testear	Testing	Medio	Sumar Vitest + React Testing Library con al menos tests basicos
10	Los inputs del login no tienen id/htmlFor conectando el label con el input	Accesibilidad	Bajo	Agregar esos atributos
11	No hay manejo global de errores si algo se rompe al renderizar; solo existe la pagina de 404	Robustez	Bajo	Agregar un Error Boundary
12	Ningun componente valida sus props (no hay PropTypes ni TypeScript)
