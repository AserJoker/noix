import { Provide } from "./provide.decorator";
import { getMetadata } from "../../metadata";
import { CURRENT_FACTORY } from "../const";
const cache: Map<symbol | string, unknown> = new Map();
export const getInstance = <T = unknown>(
  token: string | symbol,
  providers: Function[],
  factory: unknown,
  params?: unknown[]
): T | undefined => {
  const _getInstance = <T = unknown>(
    token: string | symbol,
    providers: Function[],
    path: (string | symbol)[],
    params: unknown[]
  ): T | undefined => {
    if (token === CURRENT_FACTORY) {
      return factory as T;
    }
    const index = path.findIndex((p) => p === token);
    if (index !== -1) {
      const _path: (string | symbol)[] = [];
      for (let _index = index; _index < path.length; _index++) {
        _path.push(path[_index]);
      }
      _path.push(token);
      throw new Error("cycle dependence:" + _path.join("->"));
    }
    const classObject = providers.find((provider) => {
      return getMetadata(provider, "spi:provide") === token;
    }) as { new (...args: unknown[]): unknown };
    if (classObject) {
      const useCache = getMetadata(classObject, "spi:cache") as boolean;
      if (cache.has(token) && useCache) {
        return cache.get(token) as T;
      }
      const inject_constructor =
        (getMetadata(
          classObject.prototype,
          "meta:constructor",
          "spi:inject"
        ) as (string | symbol)[]) || [];
      const deps = inject_constructor.map((_token: string | symbol) => {
        if (_token) {
          return _getInstance(_token, providers, [...path, token], []);
        }
        return null;
      });
      deps.forEach((dep, index) => {
        if (dep !== null) {
          params[index] = dep;
        }
      });
      const ins = new classObject(...params);
      cache.set(token, ins);
      const inject_member =
        (getMetadata(classObject, "spi:inject") as Record<
          string,
          string | symbol
        >) || {};
      Object.keys(inject_member).forEach((name) => {
        const _token = inject_member[name];
        Reflect.set(
          ins as Object,
          name,
          _getInstance(_token, providers, [...path, token], [])
        );
      });
      return ins as T;
    }
  };
  return _getInstance<T>(token, providers, [], params || []);
};

export const Factory = (
  _token: string | symbol = Symbol("factory"),
  providers: Function[] = []
) => {
  return <
    T extends {
      new (
        getInstance: <T>(
          token: string | symbol | Function,
          params?: unknown[]
        ) => T | undefined
      ): unknown;
    }
  >(
    classObject: T
  ) => {
    if (!_token) {
      _token = Symbol(classObject.name);
    }
    providers.forEach((provider) => {
      if (!getMetadata(provider, "spi:provide")) {
        Provide(Symbol(provider.name))(provider);
      }
    });
    if (!cache.has(_token)) {
      Provide(_token)(classObject);
      const createInstance = <T>(
        token: string | symbol | Function,
        factory: unknown,
        params?: unknown[]
      ): T | undefined => {
        let _token: string | symbol;
        let _providers: Function[];
        if (typeof token === "function") {
          _token = getMetadata(token, "spi:provide");
          if (!_token) {
            _token = Symbol(token.name);
            Provide(_token)(token);
          }
          _providers = [...providers, token, classObject];
        } else {
          _token = token;
          _providers = [...providers, classObject];
        }
        return getInstance<T>(_token, _providers, factory, params);
      };
      const ins = createInstance(classObject, null, [
        (token: string | symbol | Function, params?: unknown[]) =>
          createInstance(token, ins, params),
      ]);
      cache.set(_token, ins);
    }
  };
};
