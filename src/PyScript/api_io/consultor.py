
#import pandas tools
from pandas.core.frame import DataFrame
from pandas import read_csv

#import numpy tool
from numpy import ndarray as na

#TODO: catch key exceptions

def get_select_keys(*args):
    '''
        Parameters
        ------
        *args -> key values
    '''
    # load csv data
    df = read_csv("planets_updated.csv")

    # get numpy array
    arry = df[[*args]]

    print(type(arry))
    
    
    lst_dict : dict = dict()
    t_dict : dict = dict()

class Consultor:

    def __init__(self,path: str) -> None:
        
        #file path
        self.__path = path


        pass

    def get_select_frame(self,*args):

        #add Planet header to filter
        t_args = ["Planet"]
        #add key words
        t_args.extend(list(args))
        
        #return filter data frame
        return read_csv(self.__path)[t_args]
    
    def get_row_frame(self,header_name:str):
        
        pass


if __name__ == "__main__":

    a = Consultor("planets_updated.csv")

    b = a.get_select_frame("Color","Mass")

    for c in b:
        print(c)
    print(b)

