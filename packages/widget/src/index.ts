import { createApp, defineComponent, h } from 'vue';
import { Button } from './component';
export * from './component';
createApp({
  render: () => h(defineComponent(Button as any), { text: 'hello world' })
}).mount(document.body);
