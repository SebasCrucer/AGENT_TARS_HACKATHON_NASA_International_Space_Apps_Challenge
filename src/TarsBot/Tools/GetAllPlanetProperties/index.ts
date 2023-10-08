import 'dotenv/config';
import { TarsTool } from '../TarsTool';
import { exec } from 'child_process';

export class GetAllPlanetProperties extends TarsTool<{}> {
    constructor(fields: {
        toolCallback: (feedBack: string) => void;
    }) {
        super({
            toolFunction: (q: string) => this.funcionEjemplo(q),
            toolCallback: fields.toolCallback,
            callBackFeedBack: (planet) => 'Buscando información de ' + planet + ' 🔎🪐',
            toolFunctionData: {},
            name: ('get_all_planet_properties'),
            description:
                "Use this function to fetch all information about a specific planet. Possible planet inputs: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune. The function can only accept one planet at a time. Here's the information the function will provide about the chosen planet: color, mass, diameter, density, gravity, escape_velocity, rotation_period, length_of_day, distance_from_sun, perihelion, aphelion, orbital_period, orbital_velocity, orbital_inclination, orbital_eccentricity, obliquity_to_orbit, mean_temperature, number_of_moons, ring_system, global_magnetic_field, temperature, atmospheric_composition, atmospheric_pressure, surface_features, composition."

        });
    }

    async funcionEjemplo(query: string) {
        try {
            console.log(query);

            let tool_res = ''
            exec(`python grow.py ${query}`, { cwd: './src/PyScript/' }, (error, stdout, stderr) => {
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