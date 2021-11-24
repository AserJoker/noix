import { IMetadata } from "./IMetadata";

export interface IModel extends IMetadata {
  name: string;
  displayName?: string;
  store?: boolean;
  virtual?: boolean;
}
