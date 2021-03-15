import {
  NoixObject,
  BeforeHook,
  AfterHook,
  Provide,
  Instance
} from '@noix/core';
@Provide('abc')
class Base extends NoixObject {
  private async say(str: string) {
    return str;
  }

  constructor() {
    super();
    this.say('abc').then((str) => console.log(str));
  }

  @BeforeHook('say')
  private beforeSay(str: string) {
    return ['before ' + str];
  }

  @AfterHook('say')
  private async afterSay(str: Promise<string>) {
    return (await str) + ' after';
  }
}

class Test extends NoixObject {
  @Instance('abc')
  private data!: Base;

  constructor() {
    super();
    console.log(this.data.GetClassObject().name);
  }
}
// eslint-disable-next-line no-new
new Test();
