import { GetClasses, GetMetadata, Metadata } from './Metadata';
import { ExtLoader, Instance, Provide } from './SPI';
const APIValues: Record<string, unknown> = {};
export const API = (packageName: string, interfaceName?: string) => <
  T extends Function
>(
  target: T
) => {
  Provide(
    'api.' + packageName + '.' + interfaceName ||
      target.prototype.constructor.name
  )(target);
  return Metadata(
    'API',
    'api.' + packageName + '.' + interfaceName ||
      target.prototype.constructor.name
  )(target);
};
export const API_VALUE = (name: string, value: unknown) => {
  APIValues[name] = value;
};
export const GET_API_VALUES = () => APIValues;
API('core', 'Metadata')(Metadata);
API('core', 'GetClasses')(GetClasses);
API('core', 'GetMetadata')(GetMetadata);
API('core', 'Provide')(Provide);
API('core', 'Instance')(Instance);
API('core', 'QueryInterface')(ExtLoader.QueryInterface);
API('core', 'CreateInterface')(ExtLoader.CreateInstance);
API('core', 'GetInstance')(ExtLoader.GetInstance);
