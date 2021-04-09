import { createApp, h } from 'vue';
import { Button } from './component';
export * from './component';
createApp({
  render: () => h(Button, { text: 'hello world' })
}).mount(document.body);
