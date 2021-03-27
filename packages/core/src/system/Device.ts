import { ExtLoader, Provide } from '@src/base';

export const TOKEN_DEVICE_SERVICE = 'base.device.service';
@Provide(TOKEN_DEVICE_SERVICE)
export class Device {
  private static _enableDevices: Map<string | Symbol, Device> = new Map();
  public static QueryDevice(token: string | Symbol) {
    const localDevice = Device._enableDevices.get(token);
    if (localDevice) return localDevice;
    const ClassObject = ExtLoader.QueryInterface(token) as typeof Device;
    const instance = new ClassObject();
    Device._enableDevices.set(token, instance);
    return instance;
  }
  protected constructor() {}

  public Release() {
    Device._enableDevices.forEach((v, k) => {
      if (v === this) Device._enableDevices.delete(k);
    });
  }
}
