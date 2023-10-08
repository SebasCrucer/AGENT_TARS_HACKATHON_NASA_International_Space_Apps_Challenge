import 'dotenv/config';
import { TarsTool } from '../TarsTool';
import { exec } from 'child_process';

export class GetPlanetProperties extends TarsTool<{}> {
    constructor(fields: {
        toolCallback: (feedBack: string) => void;
    }) {
        super({
            toolFunction: (q: string) => this.getPlanetProperties(q),
            toolCallback: fields.toolCallback,
            callBackFeedBack: () => 'Buscando planetas 🔎🪐',
            toolFunctionData: {},
            name: ('get_planet_properties'),
            description:
                "Use this function to fetch planet properties from a list. Possible properties: planet, color, mass, diameter, density, gravity, escape_velocity, rotation_period, length_of_day, distance_from_sun, perihelion, aphelion, orbital_period, orbital_velocity, orbital_inclination, orbital_eccentricity, obliquity_to_orbit, mean_temperature, number_of_moons, ring_system, global_magnetic_field, temperature, atmospheric_composition, atmospheric_pressure, surface_features, composition. Request 1 to 4 properties separated by commas without spaces. Example: rotation_period,length_of_day,distance_from_sun. If it doesn't works, try again."

        });
    }

    async getPlanetProperties(query: string) {
        try {
            console.log(query);

            let tool_res = ''
            exec(`python gkeys.py ${query}`, { cwd: './src/PyScript/' }, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error ejecutando el script: ${error}`);
                    return;
                }
                console.log(`Respuesta de Python: ${stdout}`);
                tool_res = stdout
                if (stderr) {
                    return `Error estándar: ${stderr}`
                }
            });
            return tool_res
        } catch (error) {
            console.log(error);
            return 'An error ocurred: ' + error;
        }
    }
}