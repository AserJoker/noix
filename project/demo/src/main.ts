const Ignore = <T>(target: T, name?: string) => {};
@Ignore
export class A {}

export class B {
  public FA() {
    console.log('FA');
  }

  @Ignore
  public FB() {
    console.log('FB');
  }

  constructor() {
    if (this.FA) {
      this.FA();
    }
    if (this.FB) {
      this.FB();
    }
  }
}
// eslint-disable-next-line no-new
new B();
