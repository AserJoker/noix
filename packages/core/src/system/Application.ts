import { EventBus } from '../event';

export class Application {
  public static EVENT_BUS = new EventBus();
  public static main(): void | number | Promise<void> | Promise<number> {}
}
