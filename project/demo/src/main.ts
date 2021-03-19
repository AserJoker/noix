import { AfterHook, BeforeHook } from '@noix/core';

class A {
  public say() {
    return this.str;
  }

  @AfterHook('say')
  public aftersay() {
    this.str = 'abc';
  }

  @BeforeHook('say')
  public beforesay(str: string) {
    console.log(str);
  }

  private str = '123';
}
console.log(new A().say());
