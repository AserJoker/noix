import { useHistory } from "../../hooks";

export const router = (
  path: string,
  param?: Record<string, unknown>,
  hash?: string
) => {
  const _router = useHistory();
  const _param: Record<string, string> = {};
  if (param) {
    Object.keys(param).forEach((name) => {
      const value = param[name];
      if (typeof value === "string") {
        _param[name] = value;
      }
      _param[name] = JSON.stringify(value);
    });
  }
  _router.push({ url: path, param: _param, hash });
};
