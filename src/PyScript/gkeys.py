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
