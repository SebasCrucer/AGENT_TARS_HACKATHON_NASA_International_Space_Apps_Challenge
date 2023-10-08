from astro_calc.calc import *
import sys


try:
    p1 = sys.argv[1]
    p2 = sys.argv[2]
    rocket = sys.argv[3]

    try:
        date = sys.argv[4]
    except IndexError:
        date = None
    
    print(calc(p1,p2,rocket,date))

except IndexError:
    print("Debes mencionar la fecha, el planeta origen, el planeta destino y el cohete de viaje")