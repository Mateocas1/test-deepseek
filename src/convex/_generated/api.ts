import type { FunctionReference } from "convex/server";

function createApiProxy(path: string[] = []): any {
  return new Proxy(
    {},
    {
      get(_target, prop) {
        if (typeof prop === "string") {
          return createApiProxy([...path, prop]);
        }
        return undefined;
      },
      apply(_target, _thisArg, _args) {
        return undefined;
      },
    }
  );
}

const handler: ProxyHandler<object> = {
  get(_target, prop) {
    if (typeof prop === "string") {
      return createApiProxy([prop]);
    }
    return undefined;
  },
};

export const api = new Proxy({}, handler) as any;
export const internal = new Proxy({}, handler) as any;
