## GetPlanetProperties
- **Descripción**: Herramienta que obtiene propiedades específicas de un planeta.
- **Importaciones**:
  - `dotenv/config`: Configuración de variables de entorno.
  - `{ TarsTool }`: Clase base para herramientas.
  - `{ exec }`: Ejecuta comandos del sistema.
- **Constructor**:
  - Acepta un objeto con un campo `toolCallback`.
  - Define la función `getPlanetProperties` como la función principal.
- **Método `getPlanetProperties`**:
  - Ejecuta un script de Python `gkeys.py` con la consulta proporcionada.
  - Devuelve la respuesta del script o un mensaje de error.

## GetAbleRockets
- **Descripción**: Herramienta que proporciona información detallada sobre cohetes disponibles.
- **Importaciones**:
  - `dotenv/config`: Configuración de variables de entorno.
  - `{ TarsTool }`: Clase base para herramientas.
- **Constructor**:
  - Acepta un objeto con un campo `toolCallback`.
  - Define la función `getAbleRockets` como la función principal.
- **Método `getAbleRockets`**:
  - Devuelve información sobre cohetes como SLS, Saturn V, Falcon Heavy y Delta IV Heavy.

## GetAllPlanetProperties
- **Descripción**: Herramienta que obtiene todas las propiedades de un planeta específico.
- **Importaciones**:
  - `dotenv/config`: Configuración de variables de entorno.
  - `{ TarsTool }`: Clase base para herramientas.
  - `{ exec }`: Ejecuta comandos del sistema.
- **Constructor**:
  - Acepta un objeto con un campo `toolCallback`.
  - Define la función `getAllPlanetProperties` como la función principal.
- **Método `getAllPlanetProperties`**:
  - Ejecuta un script de Python `grow.py` con la consulta proporcionada.
  - Devuelve la respuesta del script o un mensaje de error.

## TravelTimeCalculator
- **Descripción**: Herramienta que calcula la duración del viaje interplanetario.
- **Importaciones**:
  - `dotenv/config`: Configuración de variables de entorno.
  - `{ TarsTool }`: Clase base para herramientas.
  - `{ exec }`: Ejecuta comandos del sistema.
- **Constructor**:
  - Acepta un objeto con un campo `toolCallback`.
  - Define la función `calculateTime` como la función principal.
- **Método `calculateTime`**:
  - Ejecuta un script de Python `gcalc.py` con detalles del viaje.
  - Devuelve la duración estimada del viaje o un mensaje de error.

## TarsTool
- **Descripción**: Clase base para herramientas.
- **Importaciones**:
  - `dotenv/config`: Configuración de variables de entorno.
  - `{ DynamicTool }`: Herramienta dinámica.
  - `{ italic, yellow }`: Formateo de texto.
- **Constructor**:
  - Acepta varios campos, incluyendo `toolFunction`, `toolCallback`, `name` y `description`.
- **Método `getDynamicTool`**:
  - Devuelve una nueva instancia de `DynamicTool` con la configuración proporcionada.
