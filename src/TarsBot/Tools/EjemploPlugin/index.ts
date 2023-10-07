import 'dotenv/config';
import { TarsTool } from '../TarsTool';

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
            name: ('Book search ability for ' + fields.nombre),
            description: 'Esta es una descripción que le indica a Tars que hace la función'
        });
    }

    async funcionEjemplo(query: string, id: string) {
        try {
            return 'Respuesta del plugin a: ' + query + '. ID: ' + id
        } catch (error) {
            console.log(error);
            return 'An error ocurred: ' + error;
        }
    }
}