import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetAuthData = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const context = ctx.switchToRpc().getContext();
    return {
      user: { id: context.decodedToken.sub, email: context.decodedToken.email },
      jwt: context.jwt,
    };
  },
);
