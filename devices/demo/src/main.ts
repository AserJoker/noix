import { Device, Provide } from '@noix/core';
export const TOKEN_DEVICE_DEMO = 'base.device.demo';
@Provide(TOKEN_DEVICE_DEMO)
export class DemoDevice extends Device {
  public add(a: number, b: number) {
    return a + b;
  }
}
