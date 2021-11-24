import { defineMetadata, getMetadata } from "@noix/core";

export const Param = (key: string | Function) => {
  return <T extends Object>(proto: T, name: string, index: number) => {
    const classObject = proto.constructor as Function;
    const funInfo: Record<string, (string | Function)[]> =
      getMetadata(classObject, "mvc:handle_info") || {};
    const params = funInfo[name] || [];
    params[index] = key;
    funInfo[name] = params;
    defineMetadata(classObject, { "mvc:handle_info": funInfo });
  };
};
const Path = Param("path");
const Query = Param("query");
const Request = Param("request");
const Response = Param("response");
const Headers = Param("headers");
const Hostname = Param("hostname");
const Cookies = Param("cookies");
export { Path, Query, Request, Response, Headers, Hostname, Cookies };
