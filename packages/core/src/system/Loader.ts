import { Provide } from '@src/base';
import { Device } from './Device';

export const TOKEN_DEVICE_LOADER = 'base.device.loader';
@Provide(TOKEN_DEVICE_LOADER)
export abstract class Loader extends Device {
  public abstract Load(name: string): Promise<void>;
}
