import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { asyncLocalStorage } from 'ddd-tactical-core-boilerplate';
import { Observable } from 'rxjs';

import { AuthenticatedPrincipal } from '@src/lib/bounded-contexts/iam/authentication/domain/authenticated-principal';

@Injectable()
export class AsyncLocalStorageInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') return next.handle();

    const request = context.switchToHttp().getRequest<{
      user?: AuthenticatedPrincipal;
    }>();
    const store = asyncLocalStorage.getStore();
    if (!store) {
      throw new Error('No request context store was initialised');
    }
    if (request.user) {
      store.set('context', {
        userId: request.user.userId,
      });
    }

    return next.handle();
  }
}
