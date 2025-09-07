import { Params } from 'nestjs-pino';

const isDev = process.env.NODE_ENV === 'development';
const hasPretty = (() => {
  try {
    // จะ throw ถ้าไม่ได้ติดตั้ง pino-pretty
    require.resolve('pino-pretty');
    return true;
  } catch {
    return false;
  }
})();

export const pinoOptions: Params = {
  pinoHttp: {
    level: process.env.PINO_LEVEL || (isDev ? 'debug' : 'info'),
    transport:
      isDev && hasPretty
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
    customAttributeKeys: { req: 'request', res: 'response', err: 'error' },

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

    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        'request.headers.authorization',
        'request.headers.cookie',

        // redact ทั้ง object headers แทน
        'res.headers',
        'response.headers',

        'req.body.password',
        'req.body.token',
      ],
      censor: '[REDACTED]',
    },

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

    autoLogging: {
      // ต้องคืนค่า boolean เสมอ
      ignore: (req) => (typeof req.url === 'string' ? req.url.startsWith('/health') : false),
    },

    customLogLevel: (_req, res, err) => {
      if (err || res.statusCode >= 500) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },

    quietReqLogger: true,
  },
};
