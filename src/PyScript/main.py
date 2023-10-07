import json

# Definir un decorador
def mi_decorador(funcion_original):
    def wrapper(*args, **kwargs):
        rtn = funcion_original(*args, **kwargs)
        print(rtn)
        return rtn
    return wrapper

# Usar el decorador
@mi_decorador
def suma(a, b):

    return a + b

if __name__ == "__main__":

    suma(1,2)
