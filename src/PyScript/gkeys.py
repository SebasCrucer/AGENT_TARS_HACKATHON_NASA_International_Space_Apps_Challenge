<<<<<<< HEAD
# Import the 'Consultor' class from the 'api_io.consultor' module and the 'sys' module for handling command-line arguments.
from plugin_io.consultor import Consultor
import sys

# Retrieve the column names from the command-line arguments.
column_names = sys.argv[1]

# Create an instance of the 'Consultor' class and provide the path to a CSV file containing data (e.g., "planets_system.csv").
consultor_instance = Consultor("plugin_io\\planets_system.csv")

# Split the provided column names into a list.
column_list = column_names.split(",")

# Print the list of column names.
print(column_list)

# Try to retrieve and print the flattened keys for the specified columns using the 'get_flat_keys' method.
try:
    flattened_keys = consultor_instance.get_flat_keys(*column_list)
    print(flattened_keys)

# Catch a KeyError if the specified columns are not found.
except KeyError:
    print("No records found for the specified columns.")
=======
# Importación de módulos y bibliotecas necesarios
from api_io.consultor import Consultor  # Importa la clase Consultor del módulo consultor dentro del paquete api_io
import sys  # Biblioteca estándar para interactuar con el intérprete de Python

# Obtiene el argumento pasado al script (nombres de columnas) desde la línea de comandos
columnas = sys.argv[1]

# Crea una instancia de la clase Consultor usando el archivo 'planets_system.csv' localizado en el subdirectorio 'api_io'
a = Consultor("api_io\\planets_system.csv")

# Divide la cadena 'columnas' por comas para obtener una lista de nombres de columnas individuales
cl = columnas.split(",")
print(cl)  # Imprime la lista de nombres de columnas

# Intenta recuperar y mostrar las claves (probablemente valores únicos o identificadores) 
# de las columnas especificadas desde el archivo CSV
try:
    print(a.get_flat_keys(*cl))
except KeyError:  # Si alguna de las columnas especificadas no se encuentra en el archivo, se lanza una excepción KeyError
    print("No se hallaron registros")
>>>>>>> d5e791f5114dd33e57b75c4eb106d61330bc1bda
