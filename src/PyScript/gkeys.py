from api_io.consultor import  Consultor
import sys

columnas = sys.argv[1]
a = Consultor("api_io\\planets_system.csv")

cl = columnas.split(",")
print(cl)

try:
    print(a.get_flat_keys(*cl))

except KeyError:
    print("No se hallaron registros")

