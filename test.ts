import { Message, Parser, Segment } from 'simple-hl7';
import { DateTime } from 'luxon';

function parseHl7FileToHl7Object() {
    const message = (new Parser()).parse('MSH|^~\&|PATH|County Pathology||Optimally Me Ltd|20230313144113||ORU^R01|1704526|P|2.4|||AL|AL|GBR|ASCII|EN|||\rPID|1||OPME_Test_00002^^^^||Patient^Test^^^^^MASTER||19781124|M|||^^^^||||||||||||||||||||\rPV1||O|Optimally Me Ltd||||||||||||||||||||||||||||||||||||||||||||||||||\rORC|SC|OPME-A1B2C3v2|F260235||CM||||20230313144113|\rOBR|1|OPME-A1B2C3v2|F260235|PATH^Pathology results^ASET pathology||20230313132832|20230313144113|||||||20230313060000|V|||Report|||||||F|||\rOBX|1|ST|BILI^Total Bilirubin^ASET pathology^Biochemistry^1^0||1.0|umol/L|<24||||F|||||');
    const pidSegment = message.getSegment('PID');
    const obxSegments = message.getSegments('OBX');

    //console.log(message);
    return {
        lab: message.header.getField(2),
        createdAt: DateTime.fromFormat(message.header.getField(5), 'yyyyMMddHHmmss').isValid 
            ? DateTime.fromFormat(message.header.getField(5), 'yyyyMMddHHmmss').toJSDate()
            : null,
        id: message.header.getField(8),
        userId: pidSegment.getField(3),
        firstName: pidSegment.getField(5) && pidSegment.getField(5).split(' ')[1],
        lastName: pidSegment.getField(5) && pidSegment.getField(5).split(' ')[0],
        resultAt: undefined,
        email: undefined,
        isQuizCompleted: undefined,
        abnormalResults: undefined,
        orderId: undefined,
        testProductName: undefined,
        results: obxSegments[0].fields.length
    };
}

const parsedFile = parseHl7FileToHl7Object();
console.log(parsedFile);