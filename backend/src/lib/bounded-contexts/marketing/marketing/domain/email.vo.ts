import { Domain, Either, ok, fail } from '@bitloops/bl-boilerplate-core';
import { DomainErrors } from './errors';
import { Rules } from './rules';

interface EmailProps {
  email: string;
}

export class EmailVO extends Domain.ValueObject<EmailProps> {
  get email(): string {
    return this.props.email;
  }

  private constructor(props: EmailProps) {
    super(props);
  }

  public static create(
    props: EmailProps,
  ): Either<EmailVO, DomainErrors.InvalidEmailDomainError> {
    const res = Domain.applyRules([new Rules.ValidEmailRule(props.email)]);
    if (res) return fail(res);
    return ok(new EmailVO(props));
  }
}
