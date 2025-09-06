import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const headerKey = 'x-request-id';
    req.reqId = req.headers[headerKey] || randomUUID();
    res.setHeader(headerKey, req.reqId);
    next();
  }
}
