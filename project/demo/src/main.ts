import { NoixObject, BeforeHook, AfterHook } from '@noix/core';

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
// eslint-disable-next-line no-new
new Base();
