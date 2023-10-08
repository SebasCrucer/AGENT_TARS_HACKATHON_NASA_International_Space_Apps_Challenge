import json


def mi_decorador(funcion_original):
    def wrapper(*args, **kwargs):
        rtn = funcion_original(*args, **kwargs)
        print(rtn)
        return rtn
    return wrapper