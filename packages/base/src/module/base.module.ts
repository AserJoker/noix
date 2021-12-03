import { Body, Post } from "@noix/mvc";
import { ISchema } from "@noix/resolve";
import {
  Module,
  ModelModel,
  FieldModel,
  FunctionModel,
  OptionModel,
  MetadataModel,
  Service,
  NoixService,
} from "..";
@Module({ name: "base", displayName: "基本模块" }, [
  ModelModel,
  FieldModel,
  FunctionModel,
  OptionModel,
  MetadataModel,
])
export class Base {
  @Post
  public async onPost(
    @Service service: NoixService,
    @Body("schema") schema: ISchema,
    @Body("context") context: Record<string, unknown> | undefined
  ) {
    return await service.run(schema, context);
  }
}
