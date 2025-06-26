import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Application, Either } from '@bitloops/bl-boilerplate-core';
import { UsersService } from './users/users.service';
import { User } from './users/user.model';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user: User | null = await this.usersService.findOne(email);
    if (user) {
      const passwordsMatch = await bcrypt.compare(pass, user.password);
      if (passwordsMatch) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: User): Promise<Either<void, Application.Repo.Errors.Conflict>> {
    const hashedPassword = await this.hashPassword(user.password);
    if (!user.id) user.id = randomUUID();
    const userToBeCreated = {
      ...user,
      password: hashedPassword,
    };
    return this.usersService.create(userToBeCreated);
  }

  private hashPassword(password: string) {
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);
  }
}
