import { NoixObject } from './NoixObject';

export const Metadata: (
  name: string,
  value?: unknown
) => <T extends NoixObject, K extends typeof NoixObject>(
  target: T | K,
  fieldName?: string | undefined
) => void = Reflect.get(NoixObject, 'Metadata');
export const GetMetadata: <T extends typeof NoixObject>(
  classObject: T,
  fieldName: string,
  name?: string | undefined
) => unknown = Reflect.get(NoixObject, 'GetMetadata');
