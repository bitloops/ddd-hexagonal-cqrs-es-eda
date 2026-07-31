import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { OidcAuthGuard } from '@src/bounded-contexts/iam/iam/oidc/oidc-auth.guard';
import { AuthenticatedPrincipal } from '@src/lib/bounded-contexts/iam/authentication/domain/authenticated-principal';

@ApiTags('authentication')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  @Get('me')
  @UseGuards(OidcAuthGuard)
  @ApiOperation({ summary: 'Return the application principal for the OIDC subject' })
  me(@Request() request: { user: AuthenticatedPrincipal }) {
    return {
      id: request.user.userId,
      email: request.user.email,
      roles: request.user.roles,
    };
  }
}
