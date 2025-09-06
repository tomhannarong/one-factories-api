import { Inject, Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';
import { ALS_TOKEN, RequestContextStore } from './request-context.types';

@Injectable()
export class RequestContextService {
  constructor(@Inject(ALS_TOKEN) private readonly als: AsyncLocalStorage<RequestContextStore>) {}

  run(initial: RequestContextStore, cb: () => void) {
    this.als.run(initial, cb);
  }
  get<K extends keyof RequestContextStore>(key: K) {
    return this.als.getStore()?.[key];
  }
  set<K extends keyof RequestContextStore>(key: K, value: RequestContextStore[K]) {
    const store = this.als.getStore();
    if (store) store[key] = value;
  }
  getAll() {
    return this.als.getStore();
  }
}
