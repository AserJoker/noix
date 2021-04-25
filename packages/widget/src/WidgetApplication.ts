import { createApp, h } from 'vue';

import Root from './Root.vue';
export class WidgetApplication {
  public static Bootstrap(dom: HTMLElement) {
    createApp({
      render: () => h(Root)
    }).mount(dom);
  }
}
