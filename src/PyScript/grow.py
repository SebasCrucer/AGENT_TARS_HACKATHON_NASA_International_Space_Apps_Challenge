<<<<<<< HEAD
# Import the 'Consultor' class from the 'api_io.consultor' module and the 'sys' module for handling command-line arguments.
from plugin_io.consultor import Consultor
import sys

# Retrieve the name of the planet from the command-line arguments.
planet_name = sys.argv[1]

# Create an instance of the 'Consultor' class and provide the path to a CSV file containing data (e.g., "planets_system.csv").
consultor_instance = Consultor("plugin_io\\planets_system.csv")

# Try to retrieve and print the flattened row data for the specified planet using the 'get_flat_row' method.
try:
    flattened_row_data = consultor_instance.get_flat_row(planet_name)
    print(flattened_row_data)

# Catch a KeyError if the specified planet name is not found in the data.
except KeyError:
    print("No records found for the specified planet.")
=======
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
>>>>>>> d5e791f5114dd33e57b75c4eb106d61330bc1bda
