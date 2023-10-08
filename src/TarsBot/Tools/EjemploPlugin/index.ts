import 'dotenv/config';
import { TarsTool } from '../TarsTool';
import { exec } from 'child_process';

export class EjemploPlugin extends TarsTool<{ id: string }> {
    constructor(fields: {
        id: string,
        nombre: string;
        toolCallback: (feedBack: string) => void;
    }) {
        super({
            toolFunction: (q: string, data: { id: string }) => this.funcionEjemplo(q, data.id),
            toolCallback: fields.toolCallback,
            callBackFeedBack: (input: string) => 'Ejecutando Ejemplo' + fields.nombre + ': ' + input + ' 🔎',
            toolFunctionData: { id: fields.id },
            name: ('Ejemplo plugin ' + fields.nombre),
            description: `Esta es una función que recibe un json entre backtips con esta estructura:
            {
                "nombre": "El nombre del usuario",
                "edad": "edad del usuario",
            }
            `
        });
    }

    async funcionEjemplo(query: string, id: string) {
        try {

            console.log(query);


            const info: {
                nombre: string,
                edad: string
            } = JSON.parse(query)

            exec(`python script.py ${info.nombre} ${info.nombre}`, { cwd: './src/PythonTools' }, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error ejecutando el script: ${error}`);
                    return;
                }

                console.log(`Respuesta de Python: ${stdout}`);

                if (stderr) {
                    console.error(`Error estándar: ${stderr}`);
                }
            });
            return ''
        } catch (error) {
            console.log(error);
            return 'An error ocurred: ' + error;
        }
    }
}