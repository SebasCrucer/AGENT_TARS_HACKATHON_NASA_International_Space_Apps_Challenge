
from astropy import units as u
from astropy import coordinates as coord
from skyfield.api import load
from datetime import datetime
import math

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
