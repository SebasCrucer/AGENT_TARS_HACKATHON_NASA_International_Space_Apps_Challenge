import 'dotenv/config';
import { TarsTool } from '../TarsTool';

export class GetAbleRockets extends TarsTool<{}> {
    constructor(fields: {
        toolCallback: (feedBack: string) => void;
    }) {
        super({
            toolFunction: () => this.getAbleRockets(),
            toolCallback: fields.toolCallback,
            callBackFeedBack: () => '¡Checando disponibilidad de cohetes! 🔎🚀',
            toolFunctionData: {},
            name: ('get_rocket_info'),
            description:
                "Use this function to retrieve comprehensive data about the available rockets. The rockets in our database include: SLS, Saturn V, Falcon Heavy, and Delta IV Heavy. When you execute this function, it will provide all the details about these rockets without the need for specific queries. The details encompass description, cost, speed, and amenities. Simply run the function to receive all the information. No special requests or specific parameters are needed."

        });
    }

    async getAbleRockets() {
        try {
            const rockets_info = {
                "SLS": {
                    "Description": "Con 98 metros de altura, el SLS es el cohete más potente jamás construido por la NASA, diseñado para generar una fuerza de empuje de 8,8 millones de libras. Está compuesto por dos etapas, donde la primera utiliza cuatro motores RS-25 y la segunda un motor J-2X, ambos funcionando con hidrógeno y oxígeno líquidos.",
                    "Cost": 2000,
                    "Speed": "7.78 km/s",
                    "Amenities": "Un salón de observación exclusivo, asientos ergonómicos de lujo con función de masaje, servicio de comidas gourmet, sistema de entretenimiento a bordo y habitaciones privadas para descansar."
                },
                "Saturn V": {
                    "Description": "El Saturn V, con 110.6 metros de altura, es el cohete más grande y poderoso jamás construido, utilizado principalmente para misiones lunares. Genera una fuerza de empuje de 7,5 millones de libras y está compuesto por tres etapas con motores F-1 y J-2.",
                    "Cost": 1500,
                    "Speed": "11 km/s",
                    "Amenities": "Un bar y lounge espacial, terraza con vistas al espacio, servicio de guía turístico espacial, habitaciones con camas de gravedad cero y un gimnasio espacial."
                },
                "Falcon Heavy": {
                    "Description": "Desarrollado por SpaceX, el Falcon Heavy mide 70 metros y es el cohete más potente en servicio actualmente. Genera una fuerza de empuje de 5,1 millones de libras y se compone de tres núcleos Falcon 9 equipados con motores Merlin.",
                    "Cost": 150,
                    "Speed": "7.5 km/s",
                    "Amenities": "Cápsula con ventanas de 360 grados, asientos reclinables de alta tecnología, barra de oxígeno y aromaterapia, sesiones de meditación en el espacio y internet de alta velocidad."
                },
                "Delta IV Heavy": {
                    "Description": "El Delta IV Heavy mide 72 metros y es el segundo cohete más grande y potente en servicio. Puede generar una fuerza de empuje de 2,1 millones de libras y se compone de tres núcleos Delta IV con motores RS-68A.",
                    "Cost": 350,
                    "Speed": "9.2 km/s",
                    "Amenities": "Biblioteca espacial, observatorio con telescopios, clases de astronomía, habitaciones suites con vistas al espacio y servicio de spa y bienestar."
                }
            }

            return JSON.stringify(rockets_info)
        } catch (error) {
            console.log(error);
            return 'An error ocurred: ' + error;
        }
    }
}