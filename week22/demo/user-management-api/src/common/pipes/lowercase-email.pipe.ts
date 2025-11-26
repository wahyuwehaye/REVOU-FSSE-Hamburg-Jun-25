import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class LowercaseEmailPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === 'object' && value !== null && value.email) {
      return {
        ...value,
        email: value.email.toLowerCase(),
      };
    }
    return value;
  }
}
