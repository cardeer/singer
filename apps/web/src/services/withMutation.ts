/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { BaseApi } from './BaseApi';

export type WithMutation<T extends BaseApi> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? {
        (...args: Parameters<T[K]>): ReturnType<T[K]>;
        mutation: (args: [...Parameters<T[K]>]) => ReturnType<T[K]>;
      }
    : never;
};

export function withMutation<T extends BaseApi>(api: T): WithMutation<T> {
  const proxy = new Proxy(api, {
    get(target, property: string) {
      if (!target[property] || typeof target[property] !== 'function')
        return undefined;

      const defaultFn = target[property] as Function;

      // @ts-ignore
      if (!defaultFn.mutation) {
        Object.defineProperty(defaultFn, 'mutation', {
          value: async (args: unknown[]) => {
            return await defaultFn.call(target, ...args);
          },
        });
      }

      return defaultFn;
    },
  });

  return proxy as WithMutation<T>;
}
