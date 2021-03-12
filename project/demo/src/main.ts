import { NoixObject } from '@noix/core';

class Base extends NoixObject {
  @NoixObject.Metadata('value', 123)
  protected a = 123;

  @NoixObject.Metadata('value', 345)
  private b = 345;
}
class A extends Base {}
console.log(NoixObject.GetMetadata(A, 'a', 'value'));
