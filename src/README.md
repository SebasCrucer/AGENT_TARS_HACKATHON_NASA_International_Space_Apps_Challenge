## AgentConfig
- **Descripción**: Configuración del agente.
- **Propiedades**:
  - `iTool`: Booleano que indica si se utiliza iTool.
  - `modelType`: Tipo de modelo ("basic" o "premium").
  - `budget`: Presupuesto.
  - `role`: Rol del agente.
  - `name`: Nombre del agente.
  - `respondTo`: Configuración de respuesta.

## AgentHandler
- **Descripción**: Manejador del agente.
- **Importaciones**:
  - `StatusCode`, `WhatsAppClient`, `WhatsAppSessions` de "./WhatsApp".
  - `events`, `params` de "./events".
- **Propiedades**:
  - `agentId`: ID del agente.
  - `client`: Cliente de WhatsApp.
- **Constructor**:
  - Inicializa el `agentId` y el cliente de WhatsApp.
- **Métodos**:
  - `init`: Inicializa el agente.
  - `reset`: Reinicia el agente.

## generateResponse
- **Descripción**: Genera una respuesta basada en la entrada.
- **Importaciones**:
  - `Tars` y varias herramientas de './TarsBot'.
- **Función**:
  - Toma un `jid`, `input`, `agent_id`, `params` y una función `sendMessage`.
  - Devuelve una respuesta generada.

## events
- **Descripción**: Eventos para el manejo de mensajes.
- **Función**:
  - Toma `params` y devuelve callbacks para manejar mensajes.

## Script de Inicialización
- **Descripción**: Script principal para inicializar el agente.
- **Importaciones**:
  - Varios módulos, incluyendo `AgentHandler`, `DB`, `QRCode`, etc.
- **Función**:
  - Configura el entorno.
  - Inicializa la base de datos.
  - Crea o recupera agentes y los inicializa.
  - Muestra códigos QR y mensajes de estado.
