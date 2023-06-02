import { Injectable } from '@nestjs/common';
import { Hl7Object } from './models/hl7-object.entity';
import { Message, Parser, Segment } from 'simple-hl7';
import { DateTime } from 'luxon';
import { SexTypes } from '../../common/src/resources/filters/sex-types';
import { Hl7ObjectStatuses } from '../../common/src/resources/hl7/hl7-object-statuses';
import * as uuid from 'uuid';
import { OBX_FIELDS_NUMBER_ERROR, OBX_MIN_FIELDS_NUMBER, PID_3_USER_PREFIX, USER_ID_FROM_PID_3 } from '../../common/src/resources/hl7/hl7-constants';

export interface IHl7Object {
    id?: number;
    userId?: number;
    fileId?: number;
    statusFileId?: number;
    resultFileId?: number;
    lab?: string;
    orderId?: number;
    testProductName?: string;
    sampleCode?: string;
    status?: Hl7ObjectStatuses;
    email?: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    sex?: SexTypes;
    activatedAt?: Date | any;
    sampleAt?: Date | any;
    labReceivedAt?: Date | any;
    resultAt?: Date | any;
    isQuizCompleted?: boolean;
    labId?: string;
    abnormalResults?: string;
    failedTests?: string;
    toFollow?: string;
    createdAt?: Date | any;
    updatedAt?: Date | any;
    results?: IResultObject[];
}

interface IResultObject {
    biomarkerShortName: string,
    value: number,
    unit: string,
    toFollow?: string,
    failedTests?: string,
    isError: boolean,
}

const sexTypeToHl7Sex = {
    [SexTypes.male]: 'M',
    [SexTypes.female]: 'F',
};

const hl7SexToSexType = {
    'M': SexTypes.male,
    'F': SexTypes.female
};

const hl7FileStatusToHl7ObjectStatuses = {
    'IP': Hl7ObjectStatuses.inProgress,
    'CM': Hl7ObjectStatuses.verified,
};

@Injectable()
export class Hl7FilesService {
    createHl7FileFromHl7Object(hl7Object: Hl7Object): string {
        const message = new Message();

        const mshSegment = message.header;
        mshSegment.addField('OPME', 2);
        mshSegment.addField(hl7Object.lab, 3);
        mshSegment.addField(DateTime.fromJSDate(hl7Object.createdAt).toFormat('yyyyMMddHHmmss'), 5);
        mshSegment.addField('OMG^O19^OMG_019', 7);
        mshSegment.addField(uuid.v4(), 8);
        mshSegment.addField('P', 9);
        mshSegment.addField('2.4', 10);
        mshSegment.addField('1', 11);
        mshSegment.addField('GBR', 15);
        mshSegment.addField('ASCII', 16);
        mshSegment.addField('EN', 17);

        const pidSegment = message.addSegment(['PID']);
        pidSegment.addField('1', 1);
        pidSegment.addField(hl7Object.userId, 2);
        pidSegment.addField(`${PID_3_USER_PREFIX}${hl7Object.userId}`, 3);
        pidSegment.addField(`${hl7Object.lastName}^${hl7Object.firstName}`, 5);
        pidSegment.addField(DateTime.fromFormat(hl7Object.dateOfBirth, 'yyyy-MM-dd').toFormat('yyyyMMdd'), 7);
        pidSegment.addField(sexTypeToHl7Sex[hl7Object.sex], 8);

        const orcSegment = message.addSegment(['ORC']);
        orcSegment.addField('NW', 1);
        orcSegment.addField(hl7Object.sampleCode, 2);
        orcSegment.addField(DateTime.fromJSDate(hl7Object.activatedAt).toFormat('yyyyMMddHHmmss'), 9);

        const obrSegment = message.addSegment(['OBR']);
        obrSegment.addField('1', 1);
        obrSegment.addField(hl7Object.sampleCode, 2);
        obrSegment.addField(hl7Object.labId || '', 4);
        obrSegment.addField('Normal', 5);

        console.log(JSON.stringify(message));

        return message.toString().replace(/\n|\r\n|\r/g, '\r\n');
    }

    parseHl7FileToHl7Object(messageString: string): IHl7Object {
        const message = (new Parser()).parse(messageString);
        const pidSegment = message.getSegment('PID');
        const orcSegment = message.getSegment('ORC');
        const obrSegment = message.getSegment('OBR');
        const obxSegments = message.getSegments('OBX');
        const results = this.parseObxSegmentToResultArrays(obxSegments);

        const matches = USER_ID_FROM_PID_3.exec(pidSegment.getField(3));

        return {
            lab: message.header.getField(2),
            createdAt: DateTime.fromFormat(message.header.getField(5), 'yyyyMMddHHmmss').isValid 
                ? DateTime.fromFormat(message.header.getField(5), 'yyyyMMddHHmmss').toJSDate()
                : null,
            id: message.header.getField(8),
            userId: matches && parseInt(matches[1]),
            firstName: pidSegment.getField(5) && pidSegment.getField(5).split(' ')[1],
            lastName: pidSegment.getField(5) && pidSegment.getField(5).split(' ')[0],
            dateOfBirth: DateTime.fromFormat(pidSegment.getField(7), 'yyyyMMdd').isValid
                ? DateTime.fromFormat(pidSegment.getField(7), 'yyyyMMdd').toFormat('yyyy-MM-dd')
                : null,
            sex: pidSegment.getField(8) && hl7SexToSexType[pidSegment.getField(8)],
            sampleCode: orcSegment.getField(2),
            status: orcSegment.getField(5) && hl7FileStatusToHl7ObjectStatuses[orcSegment.getField(5)],
            activatedAt: DateTime.fromFormat(orcSegment.getField(9), 'yyyyMMddHHmmss').isValid
                ? DateTime.fromFormat(orcSegment.getField(9), 'yyyyMMddHHmmss').toISO()
                : null,
            labId: obrSegment.getField(3),
            labReceivedAt: DateTime.fromFormat(obrSegment.getField(6), 'yyyyMMddHHmmss').isValid
                ? DateTime.fromFormat(obrSegment.getField(6), 'yyyyMMddHHmmss').toISO()
                : null,
            sampleAt: DateTime.fromFormat(obrSegment.getField(14), 'yyyyMMddHHmmss').isValid
                ? DateTime.fromFormat(obrSegment.getField(14), 'yyyyMMddHHmmss').toISO()
                : null,
            results: results,
            failedTests: results
                .filter(result => !!result.failedTests)
                .map(result => result.failedTests)
                .join(',\n'),
            toFollow: results
                .filter(result => !!result.toFollow)
                .map(result => result.toFollow)
                .join(',\n'),
            resultAt: undefined,
            email: undefined,
            isQuizCompleted: undefined,
            abnormalResults: undefined,
            orderId: undefined,
            testProductName: undefined,
        };
    }

    parseObxSegmentToResultArrays(obxSegments: Segment[]): IResultObject[] {
        return obxSegments.map(obxSegment => {
            let toFollow = isNaN(obxSegment.getField(5))
                ? `${obxSegment.getComponent(3, 2)} ${obxSegment.getField(5)}`
                : null;

            if (obxSegment.fields.length < OBX_MIN_FIELDS_NUMBER) {
                toFollow = toFollow
                    ? `${OBX_FIELDS_NUMBER_ERROR},\n${toFollow}`
                    : OBX_FIELDS_NUMBER_ERROR;
            }

            return {
                biomarkerShortName: obxSegment.getComponent(3, 1),
                value: obxSegment.getField(5),
                unit: obxSegment.getField(6),
                failedTests: isNaN(obxSegment.getField(5))
                    ? `${obxSegment.getComponent(3, 2)} due to ${obxSegment.getField(5)}`
                    : null,
                toFollow,
                isError: isNaN(obxSegment.getField(5)),
            };
        });
    }
}
