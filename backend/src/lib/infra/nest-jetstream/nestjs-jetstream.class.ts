import { Logger } from '@nestjs/common';
import { Mutex } from 'async-mutex';
import { connect, JetStreamManager, NatsConnection, ConnectionOptions } from 'nats';

/**
 * @description NATS setup from https://github.com/nats-io/nats.js
 */
export class NestjsJetstream {
  private logger: Logger = new Logger(this.constructor.name);
  private nc: NatsConnection;
  private jsm: JetStreamManager;
  private mutex: Mutex;

  constructor() {
    this.mutex = new Mutex();
  }

  async connect(options: ConnectionOptions) {
    try {
      this.nc = await connect(options);
      this.jsm = await this.nc.jetstreamManager();
      this.logger.log(`connected to ${this.nc.getServer()}`);

      return this;
    } catch (e: any) {
      this.logger.error(e);
      throw new Error(e);
    }
  }

  getConnection() {
    return this.nc;
  }

  isConnected() {
    return this.nc && !this.nc.isClosed() === true;
  }

  /**
   * Close NATS connection
   */
  async close() {
    await this.nc.close();
    return this;
  }

  async listAllStreams(): Promise<Array<{ name: string; subjects: string[] }>> {
    const streams = await this.jsm.streams.list().next();
    return streams.map((stream) => ({
      name: stream.config.name,
      subjects: stream.config.subjects,
    }));
  }

  async createStreamIfNotExists(stream: string, subject: string): Promise<void> {
    // We use locks here, because of race conditions when run by multiple subscribes in parallel
    await this.mutex.runExclusive(async () => {
      if (await this.streamAndSubjectExists(stream, subject)) return;

      if (await this.streamExists(stream)) {
        await this.addSubjectToStream(stream, subject);
        return;
      }

      await this.createStreamWithSubject(stream, subject);
    });
  }

  async streamAndSubjectExists(stream: string, subject: string): Promise<boolean> {
    const streams = await this.listAllStreams();
    const streamExists = streams.find((s) => s.name === stream);
    if (!streamExists) return false;
    const subjectExists = streamExists.subjects.find((s) => s === subject);
    return !!subjectExists;
  }
  async streamExists(stream: string): Promise<boolean> {
    const streams = await this.listAllStreams();
    const streamExists = streams.find((s) => s.name === stream);
    return !!streamExists;
  }

  async addSubjectToStream(stream: string, subject: string): Promise<void> {
    const streamInfo = await this.jsm.streams.info(stream);

    streamInfo.config.subjects.push(subject);
    await this.jsm.streams.update(stream, streamInfo.config);
  }

  async createStreamWithSubject(stream: string, subject: string): Promise<void> {
    await this.jsm.streams.add({ name: stream, subjects: [subject] });
  }

  async deleteStream(stream: string): Promise<void> {
    await this.jsm.streams.delete(stream);
  }
}
