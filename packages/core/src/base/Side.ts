import { Metadata } from './Metadata';

export const ClientSide = <T extends Object, K extends Function>(
  target: T | K,
  name?: string
) => {
  return Metadata('side', 'client')(target, name);
};
export const ServerSide = <T extends Object, K extends Function>(
  target: T | K,
  name?: string
) => {
  return Metadata('side', 'server')(target, name);
};
