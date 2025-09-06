import { Params } from 'nestjs-pino';

const isDev = process.env.NODE_ENV === 'development';

export const pinoOptions: Params = {
  pinoHttp: {
    level: process.env.PINO_LEVEL || (isDev ? 'debug' : 'info'),
    transport: isDev
      ? {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,

    messageKey: 'message',
    customAttributeKeys: {
      req: 'request',
      res: 'response',
      err: 'error',
    },

    serializers: {
      req: (req: any) => ({
        id: req.reqId,
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.headers?.['user-agent'],
      }),
      res: (res: any) => ({ statusCode: res.statusCode }),
    },

    redact: [
      'req.headers.authorization',
      'req.headers.cookie',
      'res.headers.set-cookie',
      'req.body.password',
      'req.body.token',
    ],

    customProps: (req: any) => {
      const orgId =
        (req.headers?.['x-org-id'] as string | undefined) ??
        (req.user?.orgId as string | undefined);
      const factoryId =
        (req.headers?.['x-factory-id'] as string | undefined) ??
        (req.params?.factoryId as string | undefined) ??
        (req.query?.factoryId as string | undefined);
      const userId = (req.user?.sub as string | undefined) ?? (req.user?.id as string | undefined);
      return { reqId: req.reqId, orgId, factoryId, userId };
    },

    // ❗ Fix TS: ensure the predicate returns strictly boolean
    autoLogging: {
      ignore: (req) => (typeof req.url === 'string' ? req.url.startsWith('/health') : false),
      // หรือใช้ตัวเลือกนี้ถ้ารุ่น pino-http รองรับ:
      // ignorePaths: ['/health', '/health/ready'],
    },

    customLogLevel: (_req, res, err) => {
      if (err || res.statusCode >= 500) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },

    quietReqLogger: true,
  },
};
