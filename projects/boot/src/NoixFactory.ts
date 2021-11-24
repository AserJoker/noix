import { Factory, IFactory } from "@noix/core";
import { datasource_providers } from "@noix/data";
import { NoixService } from "./base";
@Factory(Symbol(), [NoixService, ...datasource_providers])
export class NoixFactory implements IFactory {
  public static theFactory: NoixFactory;
  public constructor(
    public createInstance: <T>(
      token: string | symbol | Function
    ) => T | undefined
  ) {
    NoixFactory.theFactory = this;
  }
}
