import { Injectable } from '@nestjs/common';
import { Hl7Object, IHl7Object } from './models/hl7-object.entity';
import { Message, Parser } from 'simple-hl7';
import { DateTime } from 'luxon';
import { SexTypes } from '../../common/src/resources/filters/sex-types';
import { Hl7ObjectStatuses } from 'apps/common/src/resources/hl7/hl7-object-statuses';

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
        mshSegment.addField('OM', 2);
        mshSegment.addField(hl7Object.lab, 3);
        mshSegment.addField(DateTime.fromJSDate(hl7Object.createdAt).toFormat('yyyyMMddHHmmss'), 5);
        mshSegment.addField('OMG^019', 7);
        mshSegment.addField(hl7Object.id, 8);
        mshSegment.addField('P', 9);
        mshSegment.addField('2.4', 10);
        mshSegment.addField('1', 11);
        mshSegment.addField('GBR', 15);
        mshSegment.addField('ASCII', 16);
        mshSegment.addField('ENG', 17);

        const pidSegment = message.addSegment(['PID']);
        pidSegment.addField('1', 1);
        pidSegment.addField(hl7Object.userId, 3);
        pidSegment.addField(`${hl7Object.lastName} ${hl7Object.firstName}`, 5);
        pidSegment.addField(DateTime.fromFormat(hl7Object.dateOfBirth, 'yyyy-MM-dd').toFormat('yyyyMMdd'), 7);
        pidSegment.addField(sexTypeToHl7Sex[hl7Object.sex], 8);

        const orcSegment = message.addSegment(['ORC']);
        orcSegment.addField('NW', 1);
        orcSegment.addField(hl7Object.sampleCode, 2);
        orcSegment.addField(DateTime.fromJSDate(hl7Object.activatedAt).toFormat('yyyyMMddHHmmss'), 9);

        const obrSegment = message.addSegment(['OBR']);
        obrSegment.addField('1', 1);
        obrSegment.addField(hl7Object.sampleCode, 2);
        obrSegment.addField(hl7Object.sampleCode, 3);
        obrSegment.addField('Normal', 5);

        return message.toString();
    }

    parseHl7FileToHl7Object(messageString: string): IHl7Object {
        const message = (new Parser()).parse(messageString);
        const pidSegment = message.getSegment('PID');
        const orcSegment = message.getSegment('ORC');
        const obrSegment = message.getSegment('OBR');
        const obxSegment = message.getSegment('OBX');

        return {
            lab: message.header.getField(3),
            createdAt: message.header.getField(5) && DateTime.fromFormat(message.header.getField(5), 'yyyyMMddHHmmss').toJSDate(),
            id: message.header.getField(8),
            userId: pidSegment.getField(3),
            firstName: pidSegment.getField(5) && pidSegment.getField(5).split(' ')[1],
            lastName: pidSegment.getField(5) && pidSegment.getField(5).split(' ')[0],
            dateOfBirth: pidSegment.getField(7) && DateTime.fromFormat(pidSegment.getField(7), 'yyyyMMdd').toFormat('yyyy-MM-dd'),
            sex: pidSegment.getField(8) && hl7SexToSexType[pidSegment.getField(8)],
            sampleCode: orcSegment.getField(2),
            status: orcSegment.getField(5) && hl7FileStatusToHl7ObjectStatuses[orcSegment.getField(5)],
            activatedAt: orcSegment.getField(9) && DateTime.fromFormat(orcSegment.getField(9), 'yyyyMMddHHmmss').toFormat('yyyy-MM-dd'),
            labId: obrSegment.getField(3),
            labReceivedAt: obrSegment.getField(6) && DateTime.fromFormat(obrSegment.getField(6), 'yyyyMMddHHmmss').toFormat('yyyy-MM-dd'),
            sampleAt: obrSegment.getField(14) && DateTime.fromFormat(obrSegment.getField(14), 'yyyyMMddHHmmss').toFormat('yyyy-MM-dd'),
            failedTests: obxSegment && obxSegment.getField(5),
            resultAt: undefined,
            email: undefined,
            isQuizCompleted: undefined,
            abnormalResults: undefined,
            toFollow: undefined,
            orderId: undefined,
            testProductName: undefined,
        };
    }
}
