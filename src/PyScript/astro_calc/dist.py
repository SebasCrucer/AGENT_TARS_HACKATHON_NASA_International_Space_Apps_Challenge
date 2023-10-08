'''


'''
from astropy.coordinates import solar_system_ephemeris, get_body
from astropy.coordinates.sky_coordinate import SkyCoord
import astropy.units as u
from astropy.time import Time
from calc import planet_mapping

# Definir la fecha y hora para la que deseas obtener las coordenadas heliocéntricas
fecha = Time('2023-10-08')

# Nombre del planeta que deseas obtener (por ejemplo, Marte)
nombre_planeta = 'mars'







def calc_min_dist(planet1 : str, planet2 : str, date = None, offset = 3,div = 3):

    def get_sq_dist(sky_coords : SkyCoord):

        a = sky_coords.cartesian
        
        return a.x.value**2+a.y.value**2+a.z.value**2
    
    

    # initial date
    if (date):
        date = Time(date)

    else:
        # Obtener la fecha y hora actuales
        date = Time.now()


        date = Time(date)

    # list to save
    date_lst = list()
    dist_list = list()
    planet_list = list()

    for iter in range(1,365//div):

        # Obtener las coordenadas heliocéntricas del planeta en la fecha especificada
        with solar_system_ephemeris.set('builtin'):
            p1 = get_body(planet1, date)
            p2 = get_body(planet2,date)

        # Obtener las coordenadas heliocéntricas
        c1 : SkyCoord = p1.heliocentrictrueecliptic
        c2 : SkyCoord = p2.heliocentrictrueecliptic

        # get square distance
        d1 = get_sq_dist(c1)
        d2 = get_sq_dist(c2)

        # add date to list
        date_lst.append(date)
        # add dist to list
        dist_list.append(abs(d1-d2))
        # add planets
        planet_list.append((planet1,planet2))

        # sum date
        date += offset*u.day

    
    index = dist_list.index(min(dist_list))

    return (planet_list[index],dist_list[index],date_lst[index].strftime('%Y-%m-%d'))

def gen():

    lst1: list = [key.lower() for key in planet_mapping.keys()]
    lst2: list = lst1.copy()

    print(lst1)

    lst2 = lst2[1:]

    rtn = list()

    for p1 in lst1:

        for p2 in lst2:

            rtn.append(calc_min_dist(p1,p2))

        lst1 = lst1[1:]
        lst2 = lst2[1:]

    return rtn

if __name__ == "__main__":

    print(gen())
    
    pass