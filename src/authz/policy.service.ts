// file: src/authz/policy.service.ts
// Optional Policy Service (DB fallback). Provide real implementation later.
export abstract class PolicyService {
  /**
   * Resolve permissions of a user for a given org/factory if token has no perms.
   */
  abstract resolvePermissions(params: {
    userId: string;
    orgId: string;
    factoryId?: string;
  }): Promise<string[]>;

  /**
   * Resolve factory ids a user can access within an org (if token has no factoryIds).
   */
  abstract resolveFactoryIds(params: { userId: string; orgId: string }): Promise<string[]>;
}
