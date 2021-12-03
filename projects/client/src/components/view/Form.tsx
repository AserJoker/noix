import {
  DefineComponent,
  defineComponent,
  h,
  inject,
  PropType,
  provide,
  watch,
} from "@vue/runtime-core";
import { NFormItem, NInput } from "naive-ui";
import { useComponent, useField } from "../../hooks";
import { IReactiveState, ObjectService } from "../../service";
import { IViewNode } from "../../types";
import style from "./index.module.scss";

export const Form = defineComponent({
  props: {
    node: {
      type: Object as PropType<IViewNode>,
      required: true,
    },
  },
  setup(props, ctx) {
    const service = new ObjectService({}, props.node);
    watch(
      () => props.node,
      (node) => {
        service.node.value = node;
      }
    );
    provide("service", service);
    return () => {
      return <div>{ctx.slots.default && ctx.slots.default()}</div>;
    };
  },
});
export const FormItem = defineComponent({
  props: {
    node: {
      type: Object as PropType<IViewNode>,
      required: true,
    },
  },
  setup(props) {
    const service = inject<ObjectService<Record<string, unknown>>>("service");
    if (!service) {
      throw new Error("service is defined");
    }
    const { value, onChange } = useField(
      service.state as IReactiveState<Record<string, unknown>>,
      (record) => record[props.node.attrs.name as string],
      (record, value) => (record[props.node.attrs.name as string] = value)
    );
    return () => {
      const { node } = props;
      const { name, component } = node.attrs as {
        name: string;
        component: string;
      };
      const Component = useComponent<DefineComponent>(component);
      return (
        <div class={style["form-item"]}>
          <NFormItem label={name} labelWidth={120} labelPlacement="left">
            {Component && h(Component, { value: value.value, onChange, node })}
          </NFormItem>
        </div>
      );
    };
  },
});
