from astropy.coordinates import solar_system_ephemeris, get_body
import astropy.units as u
from astropy.time import Time

# Definir la fecha y hora para la que deseas conocer las coordenadas heliocéntricas
fecha = Time('2023-10-08')

# Obtener las coordenadas heliocéntricas de Marte en esa fecha
with solar_system_ephemeris.set('builtin'):
    mars = get_body('mars', fecha)

# Imprimir las coordenadas heliocéntricas de Marte
print("Coordenadas Heliocéntricas de Marte:")
for a in mars.heliocentrictrueecliptic:
    print(a)

def calc_dist():

    pass