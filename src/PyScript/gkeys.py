# Import the 'Consultor' class from the 'api_io.consultor' module and the 'sys' module for handling command-line arguments.
from plugin_io.consultor import Consultor
import sys

# Retrieve the column names from the command-line arguments.
column_names = sys.argv[1]

# Create an instance of the 'Consultor' class and provide the path to a CSV file containing data (e.g., "planets_system.csv").
consultor_instance = Consultor("plugin_io\\planets_system.csv")

# Split the provided column names into a list.
column_list = column_names.split(",")

# Print the list of column names.
print(column_list)

# Try to retrieve and print the flattened keys for the specified columns using the 'get_flat_keys' method.
try:
    flattened_keys = consultor_instance.get_flat_keys(*column_list)
    print(flattened_keys)

# Catch a KeyError if the specified columns are not found.
except KeyError:
    print("No records found for the specified columns.")
