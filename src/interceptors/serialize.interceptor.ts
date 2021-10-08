import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

export class SerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    //Run something before request handled by handler (like middleware)
    console.log('Im running before the handler', context);

    return handler.handle().pipe(
      map((data: any) => {
        //run something before the response sent out
        console.log('Im running before response sent out', data);
      }),
    );
  }
}
