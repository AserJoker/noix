import { Controller, Get, Post, View } from "@noix/mvc";

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
