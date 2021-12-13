import { useHistory } from "../../hooks";

export const goto = (param: Record<string, string>) => {
  useHistory().push({
    param,
  });
};
