import * as aws from 'aws-sdk';
import { paramNames } from '../../resources/common/paramNames';

const ssm = new aws.SSM();
const paramPath = `/${process.env.PROJECT_NAME}/${process.env.ENV}`;

export class ParamsHelper {
    private static instance: ParamsHelper;
    private paramsObject = { isInit: false };

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    public static getInstance(): ParamsHelper {
        if (!ParamsHelper.instance) {
            ParamsHelper.instance = new ParamsHelper();
        }

        return ParamsHelper.instance;
    }

    async initParams(): Promise<any> {
        if (!this.paramsObject.isInit) {
            const { Parameters } = await ssm
                .getParameters({ Names: paramNames.map(paramName => `${paramPath}/${paramName}`) })
                .promise();

            Parameters.forEach(param => this.paramsObject[param.Name] = param.Value);

            this.paramsObject.isInit = true;
        }
    }

    async getParamFromStore(paramName: string) {
        if (!this.paramsObject[paramName]) {
            const { Parameter } = await ssm
                .getParameter({ Name: `${paramPath}/${paramName}` })
                .promise();

            this.paramsObject[paramName] = Parameter.Value;
        }

        return this.paramsObject[paramName];
    }

    getParam(paramName: string): any {
        return this.paramsObject[paramName];
    }

    getAllParams(): any {
        return this.paramsObject;
    }
}