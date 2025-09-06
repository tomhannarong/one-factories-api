// file: src/authz/authz.types.ts
export type Scope = 'global' | 'org' | 'factory';

export interface AuthzOptions {
  /** ต้องมีสิทธิ์ให้ครบทุกอัน */
  all?: string[];
  /** มีสิทธิ์อันใดอันหนึ่งพอ */
  any?: string[];
  /** บังคับขอบเขต */
  scope?: Scope; // default: 'org'
  /** ชื่อ header สำหรับ org (fallback ไปที่ user.orgId) */
  orgHeaderKey?: string; // default: 'x-org-id'
  /** ชื่อ header/param/query key สำหรับ factory */
  factoryKey?: string; // default: 'x-factory-id' | 'factoryId'
}

export type JwtUser = {
  sub: string;
  orgId: string;
  factoryIds?: string[];
  perms?: string[]; // permission codes e.g., ['product.read','product.manage']
};
