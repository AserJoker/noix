import { Hook } from "@noix/core";
export const Log = (msg: string, type: "before" | "after") => {
  return Hook((args, next) => {
    if (type === "before") {
      console.log(msg);
      return next();
    } else {
      const result = next();
      Promise.resolve(result).then(() => console.log(msg));
      return result;
    }
  });
};
