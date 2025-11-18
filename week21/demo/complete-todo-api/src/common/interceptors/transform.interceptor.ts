import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Response format interface
 * Mendefinisikan struktur response yang konsisten
 */
export interface Response<T> {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  data: T;
}

/**
 * Transform Interceptor
 * 
 * Membungkus semua response dalam format yang konsisten
 * Wraps all responses in a consistent format
 * 
 * Before: { id: 1, title: "Task 1" }
 * After: {
 *   success: true,
 *   statusCode: 200,
 *   timestamp: "2024-01-01T00:00:00.000Z",
 *   path: "/todos",
 *   method: "GET",
 *   data: { id: 1, title: "Task 1" }
 * }
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode: response.statusCode,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        data,
      })),
    );
  }
}
