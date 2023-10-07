import 'dotenv/config';
import { DynamicTool } from "langchain/tools";
import { italic, yellow } from 'ansi-colors';

export class TarsTool<T = object> {
    toolFunction: (query: string, data: T) => Promise<string>;
    toolCallback?: (feedBack: string) => void;
    callBackFeedBack?: (input: string) => string;
    toolFunctionData: T;
    name: string;
    description: string;

    constructor(fields: {
        toolFunction: (query: string, data: T) => Promise<string>;
        toolCallback?: (feedBack: string) => void;
        callBackFeedBack?: (input: string) => string
        toolFunctionData: T;
        name: string;
        description: string;
    }) {
        this.toolCallback = fields.toolCallback;
        this.toolFunction = fields.toolFunction;
        this.toolFunctionData = fields.toolFunctionData;
        this.callBackFeedBack = fields.callBackFeedBack;
        this.name = fields.name;
        this.description = fields.description;
    }

    async getDynamicTool() {
        const toolCallback = this.toolCallback;
        const callBackFeedBack = this.callBackFeedBack;
        const name = this.name
        return new DynamicTool({
            name: this.name.toLowerCase().replace(/ /g, '_'),
            description: this.description,
            callbacks: [{
                handleToolStart(_, input) {
                    console.log(yellow('Buscando en ' + name + ': ') + italic(input));
                    callBackFeedBack && toolCallback && toolCallback(callBackFeedBack(input));
                }
            }],
            func: (q) => this.toolFunction(q, this.toolFunctionData),
        });
    }
}