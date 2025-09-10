import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserWriteRepoPort } from '@src/lib/bounded-contexts/iam/authentication/ports/user-write.repo-port';
import { UserWritePostgresRepository } from './user-write.pg.repository';
import { UserWritePrismaRepository } from './user-write.prisma.repository';

export const USER_WRITE_REPOSITORY_TOKEN = 'USER_WRITE_REPOSITORY';

export const UserWriteRepositoryFactory: Provider = {
  provide: USER_WRITE_REPOSITORY_TOKEN,
  useFactory: (
    configService: ConfigService,
    pgRepository: UserWritePostgresRepository,
    prismaRepository: UserWritePrismaRepository,
  ): UserWriteRepoPort => {
    const usePrisma = configService.get<boolean>('USE_PRISMA_FOR_IAM', false);
    
    if (usePrisma) {
      console.log('Using Prisma repository for IAM context');
      return prismaRepository;
    } else {
      console.log('Using PostgreSQL repository for IAM context');
      return pgRepository;
    }
  },
  inject: [ConfigService, UserWritePostgresRepository, UserWritePrismaRepository],
};