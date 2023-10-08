
#import pandas tools
from pandas.core.frame import DataFrame
from pandas import read_csv

from json import dumps

#TODO: catch key exceptions


class Consultor:

    def __init__(self,path: str) -> None:
        
        #file path
        self.__path = path


        pass

    def get_flat_row(self, header_val: str):
        df: DataFrame = self.__get_row_df(header_val)

        val_dict : dict = dict()
        t_dict : dict = dict()

        # add key - value twice
        for index in range(1,len(df.values)):
            val_dict[df[index]] = df.values[index]

        print(val_dict)

            

        pass

    def get_flat_keys(self,*args):
        '''
            Filter a data frame in path

            Returns
            ------
            Data frame compose by headers passed as parameters
        '''
        # get filtered data frame
        df = self.__get_keys_df(*args)

        # init head values dictionary
        val_dict : dict = dict()
        # init total dictionary
        t_dict : dict = dict()

        # init return list (all data)
        rtn_lst : list = list()

        # for each row in data frame
        for row in df.values:
            
            # add key - value twice
            for index in range(1,len(row)):

                val_dict[args[index-1]] = row[index]

            # add header twice
            t_dict["Planet"] = row[0]
            # add values dict
            t_dict["Values"] = val_dict

            # add values dict to list
            rtn_lst.append(t_dict)
            
        return rtn_lst

    def __get_keys_df(self,*args):

        #add Planet header to filter
        t_args = ["Planet"]
        #add key words
        t_args.extend(list(args))
        
        #return filter data frame
        return read_csv(self.__path)[t_args]
    
    def __get_row_df(self, header_val: str):
        df = read_csv(self.__path)
        return df[df.iloc[:, 0] == header_val]


if __name__ == "__main__":

    a = Consultor("planets_updated.csv")

    a.get_flat_row("Mars")
    

