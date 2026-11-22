import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentAuthenticatedUser {
  id: string;
  email?: string;
}

export const CurrentUser = createParamDecorator(
  (
    _data: unknown,
    context: ExecutionContext,
  ): CurrentAuthenticatedUser | undefined => {
    const request = context.switchToHttp().getRequest();

    return request.user;
  },
);
