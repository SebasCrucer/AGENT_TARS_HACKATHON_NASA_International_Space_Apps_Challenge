# Importación de módulos y bibliotecas necesarios
from api_io.consultor import Consultor  # Importa la clase Consultor del módulo consultor dentro del paquete api_io
import sys  # Biblioteca estándar para interactuar con el intérprete de Python

# Obtiene el argumento pasado al script (nombre del planeta) desde la línea de comandos
planeta = sys.argv[1]

# Crea una instancia de la clase Consultor usando el archivo 'planets_system.csv' localizado en el subdirectorio 'api_io'
a = Consultor("api_io\\planets_system.csv")

# Intenta recuperar y mostrar la fila correspondiente al planeta especificado desde el archivo CSV
try:
    print(a.get_flat_row(planeta))
except KeyError:  # Si el planeta no se encuentra en el archivo, se lanza una excepción KeyError
    print("No se hallaron registros")
