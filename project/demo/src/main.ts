import {
  EventListener,
  EVENT_PREINITIALIZATION,
  EVENT_INITIALIZATION,
  EVENT_POSTINITIALIZATION,
  PluginApplication,
  Plugin
} from '@noix/core';
import { Button } from '@noix/widget';
const TOKEN_DEMOAPPLICATION = Symbol('demo.application');
@Plugin(TOKEN_DEMOAPPLICATION)
export class DemoApplication extends PluginApplication {
  @EventListener(EVENT_PREINITIALIZATION)
  public OnPreInitialize() {}

  @EventListener(EVENT_INITIALIZATION)
  public OnInitialize() {}

  @EventListener(EVENT_POSTINITIALIZATION)
  public OnPostInitialize() {}
}
console.log(Button);
