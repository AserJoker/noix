
    import { QueryInterface } from '@noix/core';
    export const LoadClientPlugins = async () => {
      return new Promise<void>((resolve) => {
        try {
          Reflect.set(window, 'QueryInterface', QueryInterface);
          Promise.all([import('/Users/apple/Projects/noix/project/demo/src/main.ts')]).then(() => resolve());
        } catch (e) {
          resolve();
        }
      });
    };
    
  