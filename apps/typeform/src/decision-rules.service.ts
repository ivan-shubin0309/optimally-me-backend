import { HttpStatus, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '../../common/src/utils/config/config.service';
import { Solver } from '@decisionrules/decisionrules-js';
import { TranslatorService } from 'nestjs-translator';

interface IRuleFlowData {
    customer: {
        id: number;
        attributes: string[];
    };
    biomarkerResult: {
        value: number;
        range: string;
    };
    recommendations: Array<{
        id: number;
        name: string;
    }>
    form_response: any;
}

@Injectable()
export class DecisionRulesService {
    private readonly solver: Solver;

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.solver = new Solver(configService.get('DECISION_RULES_SOLVER_API_KEY'));
    }

    solveRuleFlow(data: IRuleFlowData): Promise<any> {
        return this.solver.SolverRuleFlow(this.configService.get('DECISION_RULES_RECOMMENDATIONS_ITEM_ID'), data)
            .catch(err => {
                console.log(`\n${err.message}\n`);
                throw new UnprocessableEntityException({
                    message: err.message,
                    errorCode: 'DECISION_RULES_ERROR',
                    statusCode: HttpStatus.UNPROCESSABLE_ENTITY
                });
            });
    }
}