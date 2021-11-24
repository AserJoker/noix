import { Body, Post } from "@noix/mvc";
import { ISchema } from "@noix/resolve";
import {
  Module,
  Service,
  NoixService,
  ModelModel,
  FieldModel,
  FunctionModel,
  OptionModel,
  MetadataModel,
} from "../base";

@Module({ name: "base", displayName: "基本模块" }, [
  ModelModel,
  FieldModel,
  FunctionModel,
  OptionModel,
  MetadataModel,
])
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
