import { queryOne } from "..";

export const useView = (name: string) => {
  return queryOne<{
    xml: string;
    displayName: string;
    name: string;
    id: number;
  }>(
    "system.view",
    { name },
    { xml: "string", displayName: "string", name: "string", id: "number" }
  );
};
