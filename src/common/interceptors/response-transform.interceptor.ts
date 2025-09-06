import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { BaseResponseDTO } from '../dto/base-response.dto';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(map((data): BaseResponseDTO => ({ statusCode: 200, message: 'Success', data })));
  }
}
