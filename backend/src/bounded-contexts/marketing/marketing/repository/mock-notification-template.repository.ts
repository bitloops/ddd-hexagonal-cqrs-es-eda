import { Injectable } from '@nestjs/common';
import {
  Application,
  Either,
  ok,
} from '@bitloops/bl-boilerplate-core';
import { NotificationTemplateReadRepoPort } from '@src/lib/bounded-contexts/marketing/marketing/ports/notification-template-read.repo-port';
import { NotificationTemplateReadModel } from '@src/lib/bounded-contexts/marketing/marketing/domain/notification-template.read-model';

@Injectable()
export class MockNotificationTemplateReadRepository implements NotificationTemplateReadRepoPort {
  private templates: Map<string, any> = new Map();

  constructor() {
    // Initialize with some default templates
    this.templates.set('welcome', {
      id: 'welcome',
      type: 'WELCOME',
      subject: 'Welcome!',
      body: 'Welcome to our service!',
    });
    this.templates.set('todo-completed', {
      id: 'todo-completed', 
      type: 'TODO_COMPLETED',
      subject: 'Congratulations on completing your first todo!',
      body: 'You have successfully completed your first todo item.',
    });
  }

  async getByType(type: string): Promise<Either<NotificationTemplateReadModel | null, Application.Repo.Errors.Unexpected>> {
    const template = this.templates.get(type.toLowerCase());
    if (!template) {
      return ok(null);
    }
    return ok(NotificationTemplateReadModel.fromPrimitives(template));
  }

  async getAll(): Promise<Either<NotificationTemplateReadModel[], Application.Repo.Errors.Unexpected>> {
    const templates = Array.from(this.templates.values()).map(t => NotificationTemplateReadModel.fromPrimitives(t));
    return ok(templates);
  }

  async getById(id: string): Promise<Either<NotificationTemplateReadModel | null, Application.Repo.Errors.Unexpected>> {
    const template = this.templates.get(id);
    if (!template) {
      return ok(null);
    }
    return ok(NotificationTemplateReadModel.fromPrimitives(template));
  }
}