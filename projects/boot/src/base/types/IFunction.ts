import { IMetadata } from "./IMetadata";

export interface IFunction extends IMetadata {
  name: string;
  displayName?: string;
  params: string[];
  returnType?: string;
  array?: boolean;
  wrapper?: string;
}
