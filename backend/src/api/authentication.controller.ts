import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Inject,
  HttpStatus,
  HttpException,
  Patch,
} from '@nestjs/common';
import { ChangeEmailCommand } from '@src/lib/bounded-contexts/iam/authentication/commands/change-email.command';
import { UpdateEmailRequestDto } from './dto/update-email.dto';
import { RegisterRequestDto } from './dto/register.dto';
import { BUSES_TOKENS } from '@lib/infra/nest-jetstream';
import {
  Application,
  Infra,
  // asyncLocalStorage,
} from '@bitloops/bl-boilerplate-core';
import {
  AuthService,
  JwtAuthGuard,
  LocalAuthGuard,
} from '@lib/infra/nest-auth-passport';
import { Traceable } from '@lib/infra/telemetry';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(BUSES_TOKENS.PUBSUB_COMMAND_BUS)
    private readonly commandBus: Infra.CommandBus.IPubSubCommandBus,
    @Inject(BUSES_TOKENS.PUBSUB_QUERY_BYS)
    private readonly queryBus: Infra.QueryBus.IQueryBus,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @Traceable({
    operation: 'LoginController',
  })
  async login(@Request() req) {
    // const store = asyncLocalStorage.getStore();
    const jwt = this.authService.login(req.user);
    // this.commandBus.execute(
    //   new LogInCommand({ userId: dto.userId }),
    // );
    return jwt;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('updateEmail')
  async updateEmail(@Request() req, @Body() dto: UpdateEmailRequestDto) {
    console.log('req', req.user);
    const command = new ChangeEmailCommand({
      email: dto.email,
      userId: req.user.userId,
    });
    const results = await this.commandBus.request(command);
    if (results.isOk) return results.data;
    else throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  @Post('register')
  async register(@Body() body: RegisterRequestDto) {
    const user = { email: body.email, password: body.password };
    const result = await this.authService.register(user);
    // const command = new RegisterCommand({
    //   email: body.email,
    //   password: hashedPassword,
    // });
    // const results = await this.commandBus.request(command);
    if (result.isOk()) return result.value;
    else {
      switch (result.value.constructor) {
        case Application.Repo.Errors.Conflict:
          throw new HttpException(result.value, HttpStatus.CONFLICT);
        case Application.Repo.Errors.Unexpected:
        default:
          throw new HttpException(
            'Server error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
    // this.domainEventBus.publish(aggregate.domainEvents);
  }
}
