import {
  EventListener,
  EVENT_PREINITIALIZATION,
  EVENT_INITIALIZATION,
  EVENT_POSTINITIALIZATION,
  PluginApplication,
  Plugin
} from '@noix/core';
const TOKEN_DEMOAPPLICATION = Symbol('demo.application');
@Plugin(TOKEN_DEMOAPPLICATION)
export class DemoApplication extends PluginApplication {
  @EventListener(EVENT_PREINITIALIZATION)
  public OnPreInitialize() {
    console.log('demo pre');
  }

  @EventListener(EVENT_INITIALIZATION)
  public OnInitialize() {
    console.log('demo init');
  }

  @EventListener(EVENT_POSTINITIALIZATION)
  public OnPostInitialize() {
    console.log('demo post');
  }
}
