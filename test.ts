import { Message, Parser, Segment } from 'simple-hl7';
import { DateTime } from 'luxon';

function parseHl7FileToHl7Object() {
    const message = (new Parser()).parse('MSH|^~\&|PATH|County Pathology||Optimally Me Ltd|20230406093003||ORU^R01|1734963|P|2.4|||AL|AL|GBR|ASCII|EN|||\rPID|1||OPMETEST13^^^^||samsung^test^^^^^MASTER||19780101|M|||^^^^||||||||||||||||||||\rPV1||O|Optimally Me Ltd||||||||||||||||||||||||||||||||||||||||||||||||||\rORC|SC|OPMETEST13|F270794||CM||||20230406093003|\rOBR|1|OPMETEST13|F270794|PATH^Pathology results^ASET pathology||20230405144521|20230406093003|||||||||||Battery|||||||F|||');
    const pidSegment = message.getSegment('PID');

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
    };
}

const parsedFile = parseHl7FileToHl7Object();
console.log(parsedFile.lab);