import { Module, NoixService, Service } from "@noix/base";
import { Post, Body } from "@noix/mvc";
import { ISchema } from "@noix/resolve";
import { Menu } from "../model/menu.model";
import { Name } from "../model/name.model";
import { View } from "../model/view.model";

@Module({ name: "system", displayName: "系统模块" }, [Name, View, Menu])
export class System {
  @Post
  public async onPost(
    @Service service: NoixService,
    @Body("schema") schema: ISchema,
    @Body("context") context: Record<string, unknown> | undefined
  ) {
    const result = await service.run(schema, context);
    return result;
  }
}
