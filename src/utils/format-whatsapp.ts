import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';

export class Format {
  static whatsapp(whatsapp: string): string {
    const whatsappVerify = Number(whatsapp);

    if (
      whatsapp.length < 10 ||
      whatsapp.length > 13 ||
      Number.isNaN(whatsappVerify)
    ) {
      throw new ConflictException(
        'invalid whatsapp. Exempla: 55xx9xxxxxxxx - Between 10 and 13 numbers entered',
      );
    }

    let whatsappFormat = whatsapp;

    if (whatsapp.toString()[0] !== '5' && whatsapp[1].toString() !== '5') {
      whatsappFormat = '55' + whatsapp.toString();
    }

    if (whatsappFormat.length === 12) {
      whatsappFormat =
        whatsappFormat.substring(0, 4) + '9' + whatsappFormat.substring(4);
    }

    return whatsappFormat;
  }
}
