from api_io.consultor import  Consultor
import sys

columnas = sys.argv[1]

columnas = columnas.split(",")
a = Consultor("api_io\\planets_system.csv")

print(a.get_flat_keys(columnas))