// file: src/authz/errors.ts
export class AuthzErrorCodes {
  static readonly UNAUTHENTICATED = 'AUTHZ_UNAUTHENTICATED';
  static readonly ORG_REQUIRED = 'AUTHZ_ORG_REQUIRED';
  static readonly ORG_MISMATCH = 'AUTHZ_ORG_MISMATCH';
  static readonly FACTORY_REQUIRED = 'AUTHZ_FACTORY_REQUIRED';
  static readonly FACTORY_FORBIDDEN = 'AUTHZ_FACTORY_FORBIDDEN';
  static readonly PERMISSION_DENIED = 'AUTHZ_PERMISSION_DENIED';
}
