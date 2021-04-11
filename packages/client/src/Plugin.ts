
    import { QueryInterface } from '@noix/core';
    export const LoadClientPlugins = async () => {
      return new Promise<void>((resolve) => {
        try {
          Reflect.set(window, 'QueryInterface', QueryInterface);
          Promise.all([import('D:/Projects/noix/project/demo/src/main')]).then(() => resolve());
        } catch (e) {
          resolve();
        }
      });
    };
    
  