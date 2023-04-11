import { Domain, Either, ok, fail } from '@bitloops/bl-boilerplate-core';
import { DomainErrors } from './errors';
import { Rules } from './rules';

interface TitleProps {
  title: string;
}

export class TitleVO extends Domain.ValueObject<TitleProps> {
  get title(): string {
    return this.props.title;
  }

  private constructor(props: TitleProps) {
    super(props);
  }

  public static create(
    props: TitleProps,
  ): Either<TitleVO, DomainErrors.TitleOutOfBoundsError> {
    const res = Domain.applyRules([new Rules.TitleOutOfBounds(props.title)]);
    if (res) return fail(res);
    return ok(new TitleVO(props));
  }
}
