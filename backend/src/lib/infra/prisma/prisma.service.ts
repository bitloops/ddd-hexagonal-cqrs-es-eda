import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get<string>('DATABASE_URL'),
        },
      },
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
    });
  }

  async onModuleInit() {
    // Setup logging
    this.$on('query', (e) => {
      this.logger.debug(`Query: ${e.query} -- Params: ${e.params} -- Duration: ${e.duration}ms`);
    });

    this.$on('error', (e) => {
      this.logger.error(`Error: ${e.message}`);
    });

    this.$on('info', (e) => {
      this.logger.log(`Info: ${e.message}`);
    });

    this.$on('warn', (e) => {
      this.logger.warn(`Warn: ${e.message}`);
    });

    await this.$connect();
    this.logger.log('Prisma connected successfully');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Prisma disconnected');
  }

  async enableShutdownHooks(app: any) {
    // Use process exit handler instead of Prisma's $on for app shutdown
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}