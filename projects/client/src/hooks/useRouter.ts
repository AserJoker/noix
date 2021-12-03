import { State } from "../service";
interface IRouter {
  path: string;
  param: Record<string, string>;
  hash?: string;
}
interface IRouterOption {
  url: string;
  param?: Record<string, string>;
  hash?: string;
}
const resolveURL = (url: string): IRouter => {
  const urlObject = new URL(url);
  const param: Record<string, string> = {};
  urlObject.searchParams.forEach((value, name) => {
    param[name] = decodeURIComponent(value);
  });
  return {
    path: urlObject.pathname,
    hash: urlObject.hash,
    param,
  };
};
let router: State<IRouter> | null = null;
const getRouter = () => {
  if (router) {
    return router;
  }
  const _router = new State<IRouter>(resolveURL(location.href));
  const _pushState = history.pushState;
  const _replaceState = history.replaceState;
  history.pushState = (data, unused, url) => {
    _pushState.call(history, data, unused, url);
    _router.value = resolveURL(location.href);
  };
  history.replaceState = (data, unused, url) => {
    _replaceState.call(history, data, unused, url);
    _router.value = resolveURL(location.href);
  };
  window.addEventListener("popstate", () => {
    _router.value = resolveURL(location.href);
  });
  router = _router;
  return router;
};
const resolveRoute = (option: Partial<IRouterOption>) => {
  const { url, param, hash } = option;
  let _url = url || router?.value.path;
  if (param) {
    const keys = Object.keys(param);
    if (keys.length) {
      _url += `?${keys
        .map((key) => `${key}=${encodeURIComponent(param[key])}`)
        .join("&")}`;
    }
  }
  if (hash) {
    _url += `#${hash}`;
  }
  return _url;
};
export const useHistory = () => {
  return {
    back: () => history.back(),
    push: (option: Partial<IRouterOption>) => {
      const _url = resolveRoute(option);
      history.pushState(null, "", _url);
    },
    replace: (option: Partial<IRouterOption>) => {
      const _url = resolveRoute(option);
      history.replaceState(null, "", _url);
    },
  };
};
export const useRouter = () => {
  const _router = getRouter();
  return _router;
};
