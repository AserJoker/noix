import { Controller, Get, View, Guard } from "@noix/mvc";

@Guard({
  active: () => {
    return false;
  },
  reject: () => "demo reject",
})
@Controller("/")
export class Home {
  @View("./view/index.ejs")
  @Get
  public onGetHomepage() {
    return {
      version: {
        node: process.version,
        noix: "0.1.0",
      },
    };
  }
}
