import { Injectable } from '@nestjs/common';
import { Hl7Object } from './models/hl7-object.entity';
import { Message } from 'simple-hl7';
import { DateTime } from 'luxon';
import { SexTypes } from '../../common/src/resources/filters/sex-types';

const sexTypeToHl7Sex = {
    [SexTypes.male]: 'M',
    [SexTypes.female]: 'F',
};

@Injectable()
export class Hl7FilesService {
    createHl7FileFromHl7Object(hl7Object: Hl7Object): string {
        const message = new Message();

        const mshSegment = message.header;
        mshSegment.addField('OM', 2);
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
}
