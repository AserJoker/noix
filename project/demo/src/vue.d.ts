declare module '*.vue' {
  import { defineComponent, VNode } from 'vue';
  const Component: ReturnType<typeof defineComponent> & {
    render: (slotScope: unknown[]) => VNode | null;
  };
  export default Component;
}
