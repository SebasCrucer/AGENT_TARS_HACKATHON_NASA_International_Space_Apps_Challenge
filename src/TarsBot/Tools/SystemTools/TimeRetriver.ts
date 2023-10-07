import { TarsTool } from "../TarsTool";

export class TimeRetriever extends TarsTool<void> {

    constructor() {
        super({
            toolFunction: () => this.retrieveTime(),
            toolFunctionData: undefined,
            // "systemtool" indica que esta herramienta no debe ser mencionada como habilidad del agente
            name: 'systemtool Time Retriever',
            description: 'This function returns the current time.'
        });
    }

    async retrieveTime() {
        try {
            const time = new Date().toLocaleTimeString('en-US');
            return `The current time is ${time}`;
        } catch (error) {
            console.log(error);
            return 'An error occurred: ' + error;
        }
    }
}