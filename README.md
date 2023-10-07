# Agent TARS Hackathon NASA International Space Apps Challenge

Este repositorio contiene el código fuente del proyecto "Agent TARS" desarrollado para el Hackathon de la NASA International Space Apps Challenge.

## Estructura del Repositorio

- **src/**: Directorio principal que contiene el código fuente del proyecto.
  - **AgentHandler.ts**: Manejador principal del agente TARS.
  - **DB/**: Contiene las acciones y operaciones relacionadas con la base de datos.
    - **DBActions.ts**: Acciones específicas para la base de datos.
  - **TarsBot/**: Funcionalidades relacionadas con el bot TARS.
    - **DBMemory.ts**: Memoria y almacenamiento del bot.
    - **Tools/**: Herramientas y utilidades para el bot.
      - **EjemploPlugin/index.ts**: Ejemplo de un plugin para el bot.
      - **SystemTools/TimeRetriver.ts**: Herramienta para recuperar la hora.
  - **WhatsApp/**: Funcionalidades relacionadas con la integración de WhatsApp.
    - **Bottle/**: Módulo principal de la integración de WhatsApp.
      - **DB.ts**: Base de datos para la integración de WhatsApp.
      - **bottle/**: Funciones y utilidades para el módulo Bottle.
        - **AuthHandle.ts**: Manejador de autenticación para WhatsApp.
      - **index.ts**: Punto de entrada principal para el módulo Bottle.
  - **events.ts**: Eventos y callbacks del sistema.
  - **index.ts**: Punto de entrada principal del proyecto.

## Cómo Empezar

1. Clona el repositorio.
2. Corre `npm build` para instalar las dependencias y compilar el proyecto con `tsc`.
3. Para iniciar el proyecto, ejecuta `npm dev`.