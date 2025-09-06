export type RequestContextStore = {
  reqId?: string;
  userId?: string;
  orgId?: string;
  factoryId?: string;
  perms?: string[];
};
export const ALS_TOKEN = Symbol('ALS_TOKEN');
