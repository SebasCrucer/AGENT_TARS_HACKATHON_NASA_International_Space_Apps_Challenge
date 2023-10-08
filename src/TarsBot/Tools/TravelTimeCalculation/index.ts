import 'dotenv/config';
import { TarsTool } from '../TarsTool';
import { exec } from 'child_process';

export class TravelTimeCalculator extends TarsTool<{}> {
    constructor(fields: {
        toolCallback: (feedBack: string) => void;
    }) {
        super({
            toolFunction: async (q: string) => await this.calculateTime(q),
            toolCallback: (callback) => callback && fields.toolCallback(callback),
            callBackFeedBack: (input) => input ? 'Calculando viaje desde ' + JSON.parse(input).p1 + ' hacia ' + JSON.parse(input).p2 + ' 🚀🪐' : '',
            toolFunctionData: {},
            name: ('travel_time_calculator'),
            description:
                "This function calculates interplanetary travel duration. It needs to ALWAYS receive the travel details in a specific JSON string format. And this is essential: enclose the entire JSON structure within backticks. Here's the required structure for your input:\n\n" +
                "{\n    p1: 'starting planet',\n    p2: 'destination planet',\n    rocket: 'rocket name',\n    date: 'travel date in DD/MM/YYYY format'\n}\n\n" +
                "Stick to these planet names: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. " +
                "\n\nFor rockets, use: SLS, Saturn V, Falcon Heavy, or Delta IV Heavy only.\n\n" +
                "After inputting the JSON string, the function will provide your journey's estimated duration in hours, minutes, and seconds. Always remember: the JSON string must be inside backticks for correct processing. If it doesn't works, try again. Keep in mind that the travel duration always depends on the given date."
        });
    }

    async calculateTime(query: string): Promise<string> {
        try {
            console.log(query);
            const data: {
                p1: string,
                p2: string,
                rocket: string,
                date: string,
            } = JSON.parse(query);

            return query ? new Promise((resolve, reject) => {
                exec(`python gcalc.py "${data.p1}" "${data.p2}" "${data.rocket}" "${data.date}"`, { cwd: './src/PyScript/' }, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error ejecutando el script: ${error}`);
                        resolve(`Error ejecutando el script: ${error}`);
                        return;
                    }
                    if (stderr) {
                        resolve(`Error estándar: ${stderr}`);
                        return;
                    }
                    console.log(`Respuesta de Python: ${stdout}`);
                    resolve(stdout);
                });
            }) :
                'Please provide the necessary values to the function.'

        } catch (error) {
            console.log(error);
            return 'An error occurred: ' + error;
        }
    }
}