# Descripción del Programa:

# Importación de módulos y bibliotecas necesarios
from astro_calc.calc import *  # Importa todas las funciones y clases del módulo calc dentro del paquete astro_calc
import sys  # Biblioteca estándar para interactuar con el intérprete de Python

# Intenta recuperar los argumentos pasados al script desde la línea de comandos
try:
    # Obtiene los argumentos: planetas origen y destino, y el tipo de cohete
    p1 = sys.argv[1]
    p2 = sys.argv[2]
    rocket = sys.argv[3]

    # Intenta obtener la fecha especificada; si no se proporciona, la establece como None
    try:
        date = sys.argv[4]
    except IndexError:
        date = None
    
    # Imprime el resultado de la función calc(), la cual realiza cálculos basados en los argumentos proporcionados
    print(calc(p1, p2, rocket, date))

# Si no se proporcionan suficientes argumentos al script, imprime un mensaje de error instructivo
except IndexError:
    print("Debes mencionar la fecha, el planeta origen, el planeta destino y el cohete de viaje")
