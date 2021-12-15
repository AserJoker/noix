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

  @Post("/batch")
  public async onBatch(
    @Body
    body: { schema: ISchema; context: Record<string, unknown> | undefined }[],
    @Service service: NoixService
  ) {
    const list: Record<string, unknown>[] = [];
    await body.reduce(async (last, now, index) => {
      await last;
      list[index] = (await this.onPost(
        service,
        now.schema,
        now.context
      )) as Record<string, unknown>;
    }, new Promise<void>((resolve) => resolve()));
    return list;
  }
}
