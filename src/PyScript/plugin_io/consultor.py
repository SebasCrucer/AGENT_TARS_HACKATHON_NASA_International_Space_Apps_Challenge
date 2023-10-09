
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

    def get_flat_row_group_by(self, header1 : str, header2 : str):

        df = self.__get_row_group_by(header1,header2)

        lst = df.values.tolist()
        lst = lst[0]

        return lst[2],lst[3]
        

        pass


    def __get_row_group_by(self,header1 : str, header2: str):
        df = read_csv(self.__path)
        return df.loc[(df[df.columns[0]] == header1) & (df[df.columns[1]] == header2)]

    def get_flat_row(self, header_val: str):
        df= self.__get_row_df(header_val)

        lst = df.values.tolist()[0]

        val_dict : dict = dict()
        t_dict : dict = dict()

        for index in range(1,len(lst)-1):
            val_dict[df.columns[index]] = lst[index]
            pass

        t_dict[df.columns[0]] = lst[0]
        t_dict["Values"] = val_dict
        

        return str(t_dict)

    def __get_row_df(self, header_val: str):
        df = read_csv(self.__path)
        return df[df.iloc[:, 0] == header_val]
    
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
            t_dict[df.columns[0]] = row[0]
            # add values dict
            t_dict["Values"] = val_dict

            # add values dict to list
            rtn_lst.append(t_dict)

            t_dict = dict()
            val_dict = dict()
            
        return str(rtn_lst)

    def __get_keys_df(self,*args):

        df : DataFrame = read_csv(self.__path)
        #add Planet header to filter
        t_args = [df.columns[0]]

        
        #add key words
        t_args.extend(args)
        
        #return filter data frame
        df = read_csv(self.__path)[t_args]
        return df
    
   
    


