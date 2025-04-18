import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import crypto from 'crypto';

export class CommonFunction {
  static async generateCode(lengthCode: number) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < lengthCode) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  static generateHashInToken() {
    return crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');
  }
}
