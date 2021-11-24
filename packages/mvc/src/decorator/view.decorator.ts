import { Hook } from "@noix/core";
import ejs from "ejs";
export const View = (file: string) => {
  return Hook(async (_, next) => {
    const res: unknown = await Promise.resolve(next());
    return ejs.renderFile(file, (res as Record<string, unknown>) || {});
  });
};
