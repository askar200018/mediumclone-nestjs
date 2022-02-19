import { JWT_SECRET_KEY } from '@app/config';
import { ExpressRequestInterface } from '@app/types/express-request.interface';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { UserService } from '../user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
      const decode = verify(token, JWT_SECRET_KEY);
      const user = await this.userService.findUserById(decode.id);
      req.user = user;
      next();
    } catch {
      req.user = null;
      next();
    }
  }
}
