import { Injectable, PipeTransform } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashPasswordPipe implements PipeTransform {
  async transform(value: any) {
    if (typeof value === 'object' && value !== null && value.password) {
      const hashedPassword = await bcrypt.hash(value.password, 10);
      return {
        ...value,
        password: hashedPassword,
      };
    }
    return value;
  }
}
