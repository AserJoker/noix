import {
  DefineComponent,
  defineComponent,
  h,
  inject,
  onMounted,
  PropType,
  provide,
  watch,
} from "@vue/runtime-core";
import { NFormItem, NSpin } from "naive-ui";
import { useComponent, useField, useRef, useRouter } from "../../hooks";
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
    const service = new ObjectService<Record<string, unknown>>({}, props.node);
    const loading = useRef(service.loading);
    const router = useRouter();
    watch(
      () => props.node,
      (node) => {
        service.node.value = node;
      }
    );
    provide("service", service);
    onMounted(() => {
      if (router.raw.param.code) {
        service.state.value.code = router.raw.param.code;
        service.queryOne();
      }
    });
    return () => {
      return (
        <NSpin show={loading.value}>
          {ctx.slots.default && ctx.slots.default()}
        </NSpin>
      );
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
      (record) => record[props.node.attrs.field as string],
      (record, value) => (record[props.node.attrs.field as string] = value)
    );
    return () => {
      const { node } = props;
      const { component, displayName } = node.attrs as {
        name: string;
        component: string;
        displayName: string;
      };
      const Component = useComponent<DefineComponent>(component);
      return (
        <div class={style["form-item"]}>
          <NFormItem label={displayName} labelWidth={120} labelPlacement="left">
            {Component && h(Component, { value: value.value, onChange, node })}
          </NFormItem>
        </div>
      );
    };
  },
});
