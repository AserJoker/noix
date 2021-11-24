import { Body, Post } from "@noix/mvc";
import { ISchema } from "@noix/resolve";
import { Module, Service, NoixService } from "../base";
import { Demo } from "../model/demo.model";
import { Demo2 } from "../model/demo2.model";

@Module({ name: "base", displayName: "基本模块" }, [Demo, Demo2])
export class Base {
  @Post
  public onPost(
    @Service service: NoixService,
    @Body("schema") schema: ISchema,
    @Body("context") context: Record<string, unknown> | undefined
  ) {
    return service.run(schema, context);
  }
}
