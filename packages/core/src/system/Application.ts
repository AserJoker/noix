import { API, API_VALUE, GetInstance, Provide } from '../base';
import { EventObject } from '../event';

export const TOKEN_APPLICATION = 'base.application';

@API('core', 'Application')
export abstract class Application extends EventObject {
  public abstract main(): void | Promise<void>;
}
export const Bootstrap = <T extends typeof Application>(ClassObject: T) => {
  Provide(TOKEN_APPLICATION)(ClassObject);
  _instance = GetInstance(TOKEN_APPLICATION)!;
  _instance.main();
};

let _instance: Application | null = null;
API_VALUE('TOKEN_APPLICATION', TOKEN_APPLICATION);
