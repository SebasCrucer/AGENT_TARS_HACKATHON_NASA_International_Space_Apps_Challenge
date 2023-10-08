# 🚀 **TARS**: El Agente de Viajes Interplanetario del Futuro 🌌

## 🌟 Introducción
**TARS** es un sistema revolucionario diseñado para integrarse con plataformas de mensajería como **WhatsApp** 📱. Actúa como un agente de viajes interplanetario 🌠, proporcionando información detallada y cálculos precisos sobre viajes espaciales utilizando un avanzado **LLM** 🧠.

## 🛠 Características Principales

- **Desarrollado en TypeScript:** TARS está construido utilizando **TypeScript** 💻, lo que garantiza un código fuertemente tipado y una estructura robusta.

- **Integración con WhatsApp:** TARS se comunica directamente a través de **WhatsApp** 🟢, ofreciendo una experiencia de usuario fluida y familiar.

- **Base de Datos en PostgreSQL:** TARS utiliza una base de datos robusta en **PostgreSQL** 🗃 para almacenar y gestionar la información. Esto garantiza la persistencia, seguridad y eficiencia en el manejo de datos.

- **Uso de Langchain:** TARS utiliza **Langchain** 🔗 para gestionar las peticiones al LLM. Esto permite a TARS procesar y responder a las consultas de los usuarios con precisión y eficiencia.

- **Cálculos Orbitales:** Utilizando uno de sus plugins especializados, TARS es capaz de realizar cálculos orbitales 🌍🔭 precisos para elaborar planes de viaje interplanetario.

- **Plugins en Python:** Los plugins de TARS están desarrollados en **Python** 🐍, lo que permite una integración fluida con diversas bibliotecas y herramientas especializadas.

- **Plugins Extensibles:** TARS es altamente personalizable gracias a su arquitectura basada en plugins 🔌. Estos plugins permiten a TARS realizar cálculos específicos, como determinar distancias entre planetas o tiempos de viaje en cohetes específicos. Además, los plugins pueden extraer información de diversas fuentes, incluidas APIs especializadas como **AstroPy** y **SkyField**.

## 🪐 Información Planetaria
TARS proporciona datos detallados sobre diferentes planetas, incluyendo:

- Características físicas (color, masa, diámetro, densidad, etc.)
- Datos orbitales (distancia del sol, velocidad orbital, inclinación, etc.)
- Condiciones atmosféricas (composición, presión, temperatura, etc.)
- Características superficiales y puntos de interés.

🌌 **TARS** es la solución definitiva para aquellos interesados en explorar el espacio. Ya sea que estés planeando un viaje a Marte o simplemente quieras aprender más sobre el sistema solar, TARS tiene la respuesta. Con su combinación de tecnología avanzada, datos precisos y facilidad de uso, TARS está listo para llevarte a las estrellas ✨.

## 🛠🐍 Herramientas Python Utilizadas

**TARS** implementa herramientas desarrolladas por nuestros integrantes expertos en python, así como los módulos integrados antes mencionados.
Las herramientas incorporadas son:
- **AstroCalc**
- **Consultor**

### AstroCalc

### Consultor
El **Consultor** es un plugin del sistema TARS que agrega funcionalidad al sistema con el fin de extraer información generada por Python y realizar solicitudes formuladas en lenguaje natural que se traducen en instrucciones para obtener datos de cualquier DataFrame generado por pandas, esta función permite obtener información en tiempo real a través de APIs como AstroPy y SkyField. Estas APIs proporcionan datos sobre las coordenadas planetarias en una fecha específica. Esto otorga a TARS la capacidad de realizar cálculos en tiempo real, utilizando datos actualizados para obtener información nueva, como la distancia entre planetas y el tiempo de viaje de uno a otro en un cohete específico.
