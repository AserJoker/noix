import { Hook } from "@noix/core";
export const Catch = Hook((args, next) => {
  try {
    const result = next();
    Promise.resolve(result).catch((e) => {
      const err = e as Error;
      console.trace(err.message);
    });
    return result;
  } catch (e) {
    const err = e as Error;
    console.trace(err.message);
  }
});
