import { QueryInterface } from '@noix/core';

export const LoadClientPlugins = async () => {
  return new Promise<void>((resolve) => {
    Reflect.set(window, 'QueryInterface', QueryInterface);
    const script = document.createElement('script');
    script.src = 'noix.demo-plugin.js';
    script.onload = () => resolve();
    document.head.append(script);
  });
};
