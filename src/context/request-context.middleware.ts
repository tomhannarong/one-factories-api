import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { RequestContextService } from './request-context.service';

@Injectable()
export class AlsInitMiddleware implements NestMiddleware {
  constructor(private readonly ctx: RequestContextService) {}
  use(req: Request & { reqId?: string }, _res: Response, next: () => void) {
    this.ctx.run({ reqId: req.reqId }, next);
  }
}
