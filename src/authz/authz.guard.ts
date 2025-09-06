// file: src/authz/authz.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Optional,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTHZ_META_KEY } from './authz.constants';
import type { AuthzOptions, JwtUser } from './authz.types';
import { AuthzErrorCodes } from './errors';

// If you have ALS in Phase 1
// Replace this import path with your actual RequestContextService path
// and mark it as optional for easy adoption without ALS.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { RequestContextService } from '../context/request-context.service';
@Injectable()
export class AuthzGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Optional() private readonly ctx?: RequestContextService,
    @Optional() private readonly policy?: import('./policy.service').PolicyService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const opts =
      this.reflector.get<AuthzOptions | undefined>(AUTHZ_META_KEY, context.getHandler()) || {};

    const user: JwtUser | undefined = req.user;
    if (!user) {
      throw new ForbiddenException({
        errorCode: AuthzErrorCodes.UNAUTHENTICATED,
        message: 'Unauthenticated',
      });
    }

    // --- 1) Resolve Org ---
    const orgHeaderKey = (opts.orgHeaderKey || 'x-org-id').toLowerCase();
    const headerOrg = (req.headers?.[orgHeaderKey] as string | undefined) || undefined;
    const orgId = headerOrg || user.orgId;
    if (!orgId) {
      throw new ForbiddenException({
        errorCode: AuthzErrorCodes.ORG_REQUIRED,
        message: 'Organization is required',
      });
    }
    if (user.orgId && orgId !== user.orgId) {
      throw new ForbiddenException({
        errorCode: AuthzErrorCodes.ORG_MISMATCH,
        message: 'Org mismatch',
      });
    }

    // --- 2) Resolve Factory (when scope === 'factory') ---
    const scope = opts.scope ?? 'org';
    let requestedFactoryId: string | undefined;

    if (scope === 'factory') {
      const factoryKey = opts.factoryKey || 'x-factory-id';
      const headerKey = factoryKey.toLowerCase();
      requestedFactoryId =
        (req.headers?.[headerKey] as string | undefined) ||
        (req.params?.[factoryKey] as string | undefined) ||
        (req.query?.[factoryKey] as string | undefined) ||
        (req.body?.[factoryKey] as string | undefined);

      if (!requestedFactoryId) {
        // common fallback param names
        requestedFactoryId =
          (req.params?.factoryId as string | undefined) ||
          (req.query?.factoryId as string | undefined) ||
          (req.body?.factoryId as string | undefined);
      }

      if (!requestedFactoryId) {
        throw new ForbiddenException({
          errorCode: AuthzErrorCodes.FACTORY_REQUIRED,
          message: 'Factory is required for factory-scoped endpoint',
        });
      }

      // Validate that user can access this factory
      const allowedFactoryIds = await this.getAllowedFactoryIds(user, orgId);
      if (!allowedFactoryIds.includes(requestedFactoryId)) {
        throw new ForbiddenException({
          errorCode: AuthzErrorCodes.FACTORY_FORBIDDEN,
          message: 'Factory scope denied',
        });
      }
    }

    // --- 3) Resolve Permissions ---
    const perms = await this.getPermissions(user, orgId, requestedFactoryId);

    // Evaluate meta requirements
    if (opts.all && !this.hasAll(perms, opts.all)) {
      throw new ForbiddenException({
        errorCode: AuthzErrorCodes.PERMISSION_DENIED,
        message: `Missing required permissions: ${opts.all.filter((p) => !perms.includes(p)).join(', ')}`,
      });
    }
    if (opts.any && !this.hasAny(perms, opts.any)) {
      throw new ForbiddenException({
        errorCode: AuthzErrorCodes.PERMISSION_DENIED,
        message: `Requires any of: ${opts.any.join(', ')}`,
      });
    }

    // --- 4) Populate ALS Context (if available) ---
    this.ctx?.set('userId', user.sub);
    this.ctx?.set('orgId', orgId);
    if (requestedFactoryId) this.ctx?.set('factoryId', requestedFactoryId);
    this.ctx?.set('perms', perms);

    return true;
  }

  private hasAll(current: string[], required: string[]): boolean {
    const set = new Set(current);
    return required.every((p) => set.has(p));
  }

  private hasAny(current: string[], candidates: string[]): boolean {
    const set = new Set(current);
    return candidates.some((p) => set.has(p));
  }

  private async getPermissions(
    user: JwtUser,
    orgId: string,
    factoryId?: string,
  ): Promise<string[]> {
    if (user.perms && user.perms.length > 0) return user.perms;
    if (this.policy) {
      return this.policy.resolvePermissions({ userId: user.sub, orgId, factoryId });
    }
    // No perms available; deny by default (secure by default)
    return [];
  }

  private async getAllowedFactoryIds(user: JwtUser, orgId: string): Promise<string[]> {
    if (user.factoryIds && user.factoryIds.length > 0) return user.factoryIds;
    if (this.policy) {
      return this.policy.resolveFactoryIds({ userId: user.sub, orgId });
    }
    // No info; default deny
    return [];
  }
}
