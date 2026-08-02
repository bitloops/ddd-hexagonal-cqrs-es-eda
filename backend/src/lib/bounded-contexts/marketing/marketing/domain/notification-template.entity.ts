import { Domain, Either, ok } from 'ddd-tactical-core-boilerplate';

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

export class NotificationTemplateEntity extends Domain.Aggregate<
  NotificationTemplateProps,
  Domain.UUIDv4
> {
  private constructor(props: NotificationTemplateProps, id: Domain.UUIDv4) {
    super(props, id);
  }

  public static create(
    props: NotificationTemplateProps,
  ): Either<NotificationTemplateEntity, never> {
    const id = props.id ?? Domain.UUIDv4.generate();
    const notificationTemplate = new NotificationTemplateEntity(
      { ...props, id },
      id,
    );
    return ok(notificationTemplate);
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
    const id = Domain.UUIDv4.fromString(data.id);
    const props: NotificationTemplateProps = {
      id,
      template: data.template, // TemplateVO.create(snapshot.template),
      type: data.type, //NotificationTypeVO.create(snapshot.type),
    };
    return ok(new NotificationTemplateEntity(props, id));
  }
}
