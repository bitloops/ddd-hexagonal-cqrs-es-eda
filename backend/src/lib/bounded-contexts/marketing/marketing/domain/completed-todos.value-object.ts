import { Domain, Either, ok, fail } from 'ddd-tactical-core-boilerplate';
import { DomainErrors } from '@src/lib/bounded-contexts/marketing/marketing/domain/errors';
import { Rules } from './rules';

interface CompletedTodosProps {
  counter: number;
}

export class CompletedTodosVO extends Domain.ValueObject<CompletedTodosProps> {
  get counter(): number {
    return this.props.counter;
  }

  private constructor(props: CompletedTodosProps) {
    super(props);
  }

  public static create(
    props: CompletedTodosProps,
  ): Either<CompletedTodosVO, DomainErrors.InvalidTodosCounterError> {
    const res = Domain.applyRules([
      new Rules.CompletedTodosIsPositiveNumber(props.counter),
    ]);
    if (res) return fail(res);
    return ok(new CompletedTodosVO(props));
  }
}
