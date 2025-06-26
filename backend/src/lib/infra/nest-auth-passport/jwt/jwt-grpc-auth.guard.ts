import { Injectable, ExecutionContext, Inject } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as jwt from 'jsonwebtoken';
import { JWTSecret } from '../constants';

@Injectable()
export class JwtGrpcAuthGuard implements CanActivate {
  constructor(
    @Inject(JWTSecret)
    private jwtSecret: string,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const call = context.switchToRpc().getContext();
    const metadata = call.internalRepr;
    const bearerToken = metadata.get('authorization')?.[0].replace('Bearer ', '');

    if (!bearerToken) {
      throw new RpcException({
        code: 3,
        message: 'Missing required JWT token',
      });
    }

    try {
      const secret = this.jwtSecret;
      const payload = jwt.verify(bearerToken, secret);
      // if the token is an object and has the property exp, then it's a valid token
      if (payload === undefined) {
        throw new RpcException({
          code: 3,
          message: 'JWT token is missing',
        });
      }
      if (payload === undefined || typeof payload !== 'object' || !payload.hasOwnProperty('exp')) {
        throw new RpcException({
          code: 3,
          message: 'JWT token is invalid',
        });
      }
      const decoded: jwt.JwtPayload = payload;

      // check if the token is expired
      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        throw new RpcException({
          code: 16,
          message: 'JWT token has expired',
        });
      }
      call.decodedToken = decoded;
      call.jwt = bearerToken;
      return true;
    } catch (error) {
      throw new RpcException({ code: 3, message: 'Invalid JWT token' });
    }
  }
}
