import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { randomUUID } from 'crypto';
import { AsyncLocalStorageService } from './async-local-storage.service';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  constructor(private readonly asyncLocalStorageService: AsyncLocalStorageService) {}

  use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    const asyncLocalStorage = this.asyncLocalStorageService.asyncLocalStorage;

    // req.headers['x-correlation-id'] ||
    const correlationId: string = randomUUID().replace(/-/g, '');
    console.log(`Request... ${correlationId}`);
    asyncLocalStorage.run(this.asyncLocalStorageService.returnEmptyStore(), () => {
      this.asyncLocalStorageService.setCorrelationId(correlationId);
      next();
    });
  }
}
