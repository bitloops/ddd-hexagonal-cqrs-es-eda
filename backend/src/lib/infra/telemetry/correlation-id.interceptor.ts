import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Observable, tap } from 'rxjs';
import { asyncLocalStorage } from '@bitloops/bl-boilerplate-core';

@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const correlationId: string = randomUUID().replace(/-/g, '');
    console.log(`Request (interceptor)... ${correlationId}`);
    const initialStore = new Map();
    initialStore.set('correlationId', correlationId);
    return new Observable((observer) => {
      // create a new execution context for this observable
      asyncLocalStorage.run(initialStore, () => {
        // execute the next function in the context of this observable
        const next$ = next.handle();
        // subscribe to the observable returned by next
        next$.subscribe(observer);
      });
    }).pipe(
      tap({
        complete: () => {
          // clean up the context object when the observable completes
          asyncLocalStorage.disable();
        },
      }),
    );
  }
}
