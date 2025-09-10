import {
  Application,
  Domain,
  Either,
  Infra,
  asyncLocalStorage,
  ok,
} from '@bitloops/bl-boilerplate-core';
import { Injectable, Inject } from '@nestjs/common';
import * as jwtwebtoken from 'jsonwebtoken';
import { UserWriteRepoPort } from '@src/lib/bounded-contexts/iam/authentication/ports/user-write.repo-port';
import { UserEntity } from '@src/lib/bounded-contexts/iam/authentication/domain/user.entity';
import { EmailVO } from '@src/lib/bounded-contexts/iam/authentication/domain/email.value-object';
import { ConfigService } from '@nestjs/config';
import { AuthEnvironmentVariables } from '@src/config/auth.configuration';
import { StreamingDomainEventBusToken } from '@src/lib/bounded-contexts/iam/authentication/constants';
import { PrismaService, UUIDv7 } from '@src/lib/infra/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserWritePrismaRepository implements UserWriteRepoPort {
  private readonly JWT_SECRET: string;
  
  constructor(
    private readonly prisma: PrismaService,
    @Inject(StreamingDomainEventBusToken)
    private readonly domainEventBus: Infra.EventBus.IEventBus,
    private configService: ConfigService<AuthEnvironmentVariables, true>,
  ) {
    this.JWT_SECRET = this.configService.get('jwtSecret', { infer: true });
  }

  @Application.Repo.Decorators.ReturnUnexpectedError()
  async update(
    aggregate: UserEntity,
  ): Promise<Either<void, Application.Repo.Errors.Unexpected>> {
    try {
      const userPrimitives = aggregate.toPrimitives();
      const { id, email, password, lastLogin } = userPrimitives;

      await this.prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id },
          data: {
            email,
            password,
            lastLogin: lastLogin ? new Date(lastLogin) : null,
          },
        });
        
        // Publish domain events after successful persistence
        this.domainEventBus.publish(aggregate.domainEvents);
      });

      return ok();
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // Handle known Prisma errors (duplicate key, record not found, etc.)
        throw new Application.Repo.Errors.Unexpected(`Database error: ${error.message}`);
      }
      throw error;
    }
  }

  @Application.Repo.Decorators.ReturnUnexpectedError()
  async delete(
    aggregate: UserEntity,
  ): Promise<Either<void, Application.Repo.Errors.Unexpected>> {
    try {
      const aggregateRootId = aggregate.id;

      await this.prisma.$transaction(async (tx) => {
        await tx.user.delete({
          where: { id: aggregateRootId.toString() },
        });
        
        // Publish domain events after successful deletion
        this.domainEventBus.publish(aggregate.domainEvents);
      });

      return ok();
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          // Record not found
          throw new Application.Repo.Errors.Unexpected('User not found for deletion');
        }
        throw new Application.Repo.Errors.Unexpected(`Database error: ${error.message}`);
      }
      throw error;
    }
  }

  @Application.Repo.Decorators.ReturnUnexpectedError()
  async getById(
    id: Domain.UUIDv4,
  ): Promise<Either<UserEntity | null, Application.Repo.Errors.Unexpected>> {
    try {
      const ctx = asyncLocalStorage.getStore()?.get('context');
      const { jwt } = ctx;
      
      let jwtPayload: null | any = null;
      try {
        jwtPayload = jwtwebtoken.verify(jwt, this.JWT_SECRET);
      } catch (err) {
        throw new Error('Invalid JWT!');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: id.toString() },
      });

      if (!user) {
        return ok(null);
      }

      // Authorization check
      if (user.id !== jwtPayload.sub) {
        throw new Error('Invalid userId');
      }

      return ok(
        UserEntity.fromPrimitives({
          id: user.id,
          email: user.email,
          password: user.password,
          lastLogin: user.lastLogin?.toISOString(),
        }),
      );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new Application.Repo.Errors.Unexpected(`Database error: ${error.message}`);
      }
      throw error;
    }
  }

  @Application.Repo.Decorators.ReturnUnexpectedError()
  async getByEmail(
    email: EmailVO,
  ): Promise<Either<UserEntity | null, Application.Repo.Errors.Unexpected>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: email.email },
      });

      if (!user) {
        return ok(null);
      }

      return ok(
        UserEntity.fromPrimitives({
          id: user.id,
          email: user.email,
          password: user.password,
          lastLogin: user.lastLogin?.toISOString(),
        }),
      );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new Application.Repo.Errors.Unexpected(`Database error: ${error.message}`);
      }
      throw error;
    }
  }

  @Application.Repo.Decorators.ReturnUnexpectedError()
  async save(
    user: UserEntity,
  ): Promise<Either<void, Application.Repo.Errors.Unexpected>> {
    try {
      const userPrimitives = user.toPrimitives();
      const { email, password, lastLogin } = userPrimitives;
      
      // Generate UUID v7 for better database performance and time-ordering
      const id = userPrimitives.id || UUIDv7.generate();

      await this.prisma.$transaction(async (tx) => {
        await tx.user.create({
          data: {
            id,
            email,
            password,
            lastLogin: lastLogin ? new Date(lastLogin) : new Date(),
          },
        });
        
        // Publish domain events after successful persistence
        this.domainEventBus.publish(user.domainEvents);
      });

      return ok();
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          // Unique constraint violation
          throw new Application.Repo.Errors.Unexpected('User with this email already exists');
        }
        throw new Application.Repo.Errors.Unexpected(`Database error: ${error.message}`);
      }
      throw error;
    }
  }
}