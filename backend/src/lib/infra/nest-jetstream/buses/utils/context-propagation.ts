import { AsyncLocalStorageStore } from '@bitloops/bl-boilerplate-core';
import { MsgHdrs } from 'nats';
import { METADATA_HEADERS } from '../../jetstream.constants';

export class ContextPropagation {
  static createStoreFromMessageHeaders(headers?: MsgHdrs): AsyncLocalStorageStore {
    const correlationId = headers?.get(METADATA_HEADERS.CORRELATION_ID);
    const context = headers?.get(METADATA_HEADERS.CONTEXT);

    if (!correlationId || !context) {
      console.error('Missing correlationId or context', {
        correlationId,
        context,
      });
    }

    const contextData: AsyncLocalStorageStore = new Map(
      Object.entries({
        correlationId,
        context: context ? JSON.parse(context) : {},
      }),
    );
    return contextData;
  }
}
