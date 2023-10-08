from api_io.consultor import  Consultor
import sys

planeta = sys.argv[1]

a = Consultor("api_io\\planets_system.csv")

try:
    print(a.get_flat_row(planeta))
except KeyError:
    print("No se hallaron registros")