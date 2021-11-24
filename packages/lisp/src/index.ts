export * from './Lisp';
import { Lisp } from './Lisp';
Lisp.ctx['eq'] = <T>(left: T, right: T) => {
  return left === right;
};
Lisp.ctx['ne'] = <T>(left: T, right: T) => {
  return left !== right;
};
Lisp.ctx['gt'] = <T>(left: T, right: T) => {
  return left > right;
};
Lisp.ctx['lt'] = <T>(left: T, right: T) => {
  return left < right;
};
Lisp.ctx['ge'] = <T>(left: T, right: T) => {
  return left >= right;
};
Lisp.ctx['le'] = <T>(left: T, right: T) => {
  return left <= right;
};
Lisp.ctx['and'] = <T>(left: T, right: T) => {
  return left && right;
};
Lisp.ctx['or'] = <T>(left: T, right: T) => {
  return left || right;
};
Lisp.ctx['not'] = <T>(left: T) => {
  return !left;
};
Lisp.ctx['set'] = (
  name: string,
  value: unknown,
  ctx: Record<string, unknown>
) => {
  ctx[name] = value;
};
Lisp.ctx['in'] = (value: unknown, arr: unknown[]) => {
  return arr.includes(value);
};
Lisp.ctx['list'] = (...args: unknown[]) => {
  return args;
};
Lisp.ctx['true'] = true;
Lisp.ctx['false'] = false;
Lisp.ctx['null'] = null;
Lisp.ctx['undefined'] = undefined;
