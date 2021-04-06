import {
  EventListener,
  EVENT_PREINITIALIZATION,
  EVENT_INITIALIZATION,
  EVENT_POSTINITIALIZATION,
  PluginApplication,
  Plugin
} from '@noix/core';
import { ChildStore, SimpleStore } from '@noix/store';
const TOKEN_DEMOAPPLICATION = Symbol('demo.application');
@Plugin(TOKEN_DEMOAPPLICATION)
export class DemoApplication extends PluginApplication {
  @EventListener(EVENT_PREINITIALIZATION)
  public OnPreInitialize() {
    console.log('demo pre');
  }

  @EventListener(EVENT_INITIALIZATION)
  public OnInitialize() {
    const list = new SimpleStore<Array<string>>();
    const record = new ChildStore<string, Array<string>>(list, 0);
    record.watch((a, b) => {
      console.log(a, b);
    });
    list.value = [];
    list.value!.unshift('aaa');
    list.value!.splice(0);
  }

  @EventListener(EVENT_POSTINITIALIZATION)
  public OnPostInitialize() {
    console.log('demo post');
  }
}
