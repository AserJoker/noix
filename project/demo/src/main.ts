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
    const obj = new SimpleStore<{ user: { name: string } }>();
    obj.value = { user: { name: 'aa' } };
    const record = new ChildStore<{ name: string }, { user: { name: string } }>(
      obj,
      'user'
    );
    obj.watch((a, b) => console.log(a!.user, b!.user, 'object'));
    record.watch((a, b) => console.log(a, b, 'record'));
    obj.value = { user: { name: '333' } };
  }

  @EventListener(EVENT_POSTINITIALIZATION)
  public OnPostInitialize() {
    console.log('demo post');
  }
}
