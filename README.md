/ (repo root)
├─ src/
│ ├─ app.module.ts
│ ├─ main.ts
│ ├─ config/
│ │ ├─ app.config.ts
│ │ ├─ db.config.ts
│ │ ├─ security.config.ts
│ │ └─ config.module.ts
│ ├─ logger/
│ │ ├─ logger.module.ts
│ │ ├─ request-id.middleware.ts
│ │ └─ pino.options.ts
│ ├─ health/
│ │ ├─ health.controller.ts
│ │ └─ health.module.ts
│ ├─ common/
│ │ ├─ common.module.ts
│ │ ├─ dto/base-response.dto.ts
│ │ ├─ filters/http-exception.filter.ts
│ │ ├─ interceptors/response-transform.interceptor.ts
│ │ ├─ interceptors/logging.interceptor.ts
│ │ └─ pipes/validation.pipe.ts
│ ├─ database/
│ │ ├─ database.module.ts
│ │ ├─ data-source.ts
│ │ ├─ snake-naming.strategy.ts
│ │ ├─ entities/base.entity.ts
│ │ └─ seeds/ (seeders)
│ └─ versioning-security/
│ └─ versioning-security.module.ts
├─ migrations/
├─ .env.example
├─ package.json
├─ tsconfig.json
└─ docker-compose.yml (optional)
