import { Domain, Either, ok } from '@bitloops/bl-boilerplate-core';

export interface NotificationTemplateProps {
  id?: Domain.UUIDv4;
  template: string; //TemplateVO;
  type: string; //NotificationTypeVO;
}

type TNotificationTemplateSnapshot = {
  id: string;
  template: string;
  type: string;
};

export class NotificationTemplateEntity extends Domain.Aggregate<NotificationTemplateProps> {
  private constructor(props: NotificationTemplateProps) {
    super(props, props.id);
  }

  public static create(
    props: NotificationTemplateProps,
  ): Either<NotificationTemplateEntity, never> {
    const notificationTemplate = new NotificationTemplateEntity(props);
    return ok(notificationTemplate);
  }

  get id() {
    return this._id;
  }

  get template() {
    return this.props.template;
  }

  get type() {
    return this.props.type;
  }

  public toPrimitives(): TNotificationTemplateSnapshot {
    return {
      id: this.id.toString(),
      template: this.template,
      type: this.type,
    };
  }

  public static fromPrimitives(
    data: TNotificationTemplateSnapshot,
  ): Either<NotificationTemplateEntity, never> {
    const props: NotificationTemplateProps = {
      id: new Domain.UUIDv4(data.id) as Domain.UUIDv4,
      template: data.template, // TemplateVO.create(snapshot.template),
      type: data.type, //NotificationTypeVO.create(snapshot.type),
    };
    return NotificationTemplateEntity.create(props);
  }
}
