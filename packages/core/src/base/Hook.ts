import { NoixObject } from './NoixObject';

export const AfterHook: (
  host: string
) => <T extends NoixObject>(target: T, name: string) => void = Reflect.get(
  NoixObject,
  'AfterHook'
);
export const BeforeHook: (
  host: string
) => <T extends NoixObject>(target: T, name: string) => void = Reflect.get(
  NoixObject,
  'BeforeHook'
);
