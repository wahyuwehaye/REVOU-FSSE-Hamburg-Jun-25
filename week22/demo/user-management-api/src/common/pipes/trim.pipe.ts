import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === 'object' && value !== null) {
      return this.trimObject(value);
    }
    return typeof value === 'string' ? value.trim() : value;
  }

  private trimObject(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.trimObject(item));
    }

    if (typeof obj === 'object' && obj !== null) {
      const trimmed: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          trimmed[key] = this.trimObject(obj[key]);
        }
      }
      return trimmed;
    }

    return typeof obj === 'string' ? obj.trim() : obj;
  }
}
