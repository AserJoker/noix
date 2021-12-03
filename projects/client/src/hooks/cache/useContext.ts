import { State } from "../../service";

const globalContext = new State<Record<string, unknown>>({});
export const useContext = () => {
  return globalContext;
};
