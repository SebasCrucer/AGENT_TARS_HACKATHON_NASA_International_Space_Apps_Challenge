'''

'''
from astropy import units as u
from astropy import coordinates as coord
from skyfield.api import load
from skyfield.errors import EphemerisRangeError
from datetime import datetime
import math

# fecha dd/mm/aa, p1 ,p2, cohete
# Mapeo de nombres a identificadores de Skyfield
planet_mapping = {
    'Mercury': 'mercury',
    'Venus': 'venus',
    'Earth': 'earth',
    'Mars': 'mars',
    'Jupiter': 'jupiter barycenter',
    'Saturn': 'saturn barycenter',
    'Uranus': 'uranus barycenter',
    'Neptune': 'neptune barycenter'
}

# Velocidades de los cohetes en km/s y mapeo de nombres cortos
rocket_speeds = {
    "SLS": 28000 / 3600,
    "Saturn V": 11,
    "Falcon Heavy": 7.5,
    "Delta IV Heavy": 9.2
}


def get_planet_positions(date_str=None):
    # Cargar efemérides
    eph = load('de421.bsp')

    # Cargar tiempos
    ts = load.timescale()
    if date_str:
        date_obj = datetime.strptime(date_str, '%Y-%m-%d')
        t = ts.utc(date_obj.year, date_obj.month, date_obj.day)
    else:
        t = ts.now()

    planet_data = {}

    for planet_name, planet_id in planet_mapping.items():
        body = eph[planet_id]
        astrometric = body.at(t)
        lat, lon, distance = astrometric.ecliptic_latlon()
        planet_data[planet_name] = {
            'lat': lat.degrees,
            'lon': lon.degrees,
            'distance': distance.au
        }

    # Convertir las coordenadas eclípticas a cartesianas
    for planet, data in planet_data.items():
        r = data['distance']
        lon = math.radians(data['lon'])
        lat = math.radians(data['lat'])
        x = r * math.cos(lat) * math.cos(lon)
        y = r * math.cos(lat) * math.sin(lon)
        z = r * math.sin(lat)
        planet_data[planet]['x'] = x
        planet_data[planet]['y'] = y
        planet_data[planet]['z'] = z

    return planet_data

def calculate_distance(planet_data, planet1, planet2):
    x1, y1, z1 = planet_data[planet1]['x'], planet_data[planet1]['y'], planet_data[planet1]['z']
    x2, y2, z2 = planet_data[planet2]['x'], planet_data[planet2]['y'], planet_data[planet2]['z']
    return math.sqrt((x2 - x1)**2 + (y2 - y1)**2 + (z2 - z1)**2)

def calculate_travel_time(distance, speed):
    return distance * 1.496e8 / speed  # Convertir UA a km y dividir por la velocidad para obtener el tiempo en segundos


def calc(p1,p2,rocket,date = None):
    # Solicitar entrada del usuario
    user_input = date

    planet1 = p1
    planet2 = p2

    selected_rocket = rocket

    try:
        if user_input:
            day, month, year = map(int, user_input.split('/'))
            planet_data = get_planet_positions(f"{year}-{month}-{day}")
        else:
            planet_data = get_planet_positions()

    except EphemerisRangeError:
        print("La fecha ingresada está fuera del rango cubierto por el archivo de efemérides. Por favor, elige una fecha entre 1899-07-29 y 2053-10-09.")
        planet_data = None

    # Asegúrate de que solo continuamos si planet_data es válido
    if planet_data:

       

        if selected_rocket not in rocket_speeds:
            print("Cohete no reconocido.")
            exit()

        distance = calculate_distance(planet_data, planet1, planet2)
        time_seconds = calculate_travel_time(distance, rocket_speeds[selected_rocket])

        hours = time_seconds // 3600
        minutes = (time_seconds % 3600) // 60
        seconds = time_seconds % 60

        return f"El tiempo de viaje entre {planet1} y {planet2} usando el {selected_rocket} es aproximadamente {int(hours)} horas, {int(minutes)} minutos y {seconds:.2f} segundos."
