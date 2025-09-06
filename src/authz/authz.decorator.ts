// file: src/authz/authz.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { AUTHZ_META_KEY } from './authz.constants';
import type { AuthzOptions } from './authz.types';

export const Authz = (opts: AuthzOptions = {}) => SetMetadata(AUTHZ_META_KEY, opts);
