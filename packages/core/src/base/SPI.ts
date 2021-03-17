import { NoixObject } from './NoixObject';

const Provide: (
  token: string | Symbol
) => <T extends typeof NoixObject>(target: T) => void = Reflect.get(
  NoixObject,
  'Provider'
);
const Instance: (
  token: string | Symbol
) => <T extends NoixObject>(target: T, name: string) => void = Reflect.get(
  NoixObject,
  'Instance'
);
const ExtLoader: {
  get: (token: string | Symbol) => typeof NoixObject | undefined;
  set: <T extends typeof NoixObject>(token: string | Symbol, target: T) => void;
} = Reflect.get(NoixObject, 'ExtLoader');
export const SPI = {
  Provide,
  Instance,
  ExtLoader
};
