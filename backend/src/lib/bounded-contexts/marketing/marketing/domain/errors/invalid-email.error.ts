import { Domain } from '@bitloops/bl-boilerplate-core';

export class InvalidEmailDomainError extends Domain.Error {
  static readonly errorId = 'e09ec42c-4d31-4f7c-b68a-ac84abe9464f';

  constructor(email: string) {
    super(`Email ${email} is invalid`, InvalidEmailDomainError.errorId);
  }
}
