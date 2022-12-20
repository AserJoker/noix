import {
  DefineComponent,
  defineComponent,
  h,
  inject,
  onMounted,
  PropType,
  provide,
  Ref,
  ref,
  watch,
} from "@vue/runtime-core";
import { NFormItem, NSpin } from "naive-ui";
import {
  useComponent,
  useEffect,
  useField,
  useRef,
  useRouter,
} from "../../hooks";
import { IReactiveState, ObjectService, State } from "../../service";
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
    const service = inject<ObjectService<Record<string, unknown>>>("service");
    if (!service) {
      throw new Error("service is not defined");
    }
    const loading = useRef(service.loading);
    const param = inject<Ref<Record<string, unknown>>>("view-param");
    watch(
      () => props.node,
      (node) => {
        service.node.value = node;
      }
    );
    const validate = useRef(service.validateInfo);
    provide("service", service);
    provide("validate", validate);
    onMounted(() => {
      if (param && param.value.code) {
        service.state.value.code = param.value.code;
        service.queryOne();
      }
    });
    return () => {
      return (
        <NSpin show={loading.value} class={style.form}>
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
  setup(props, { slots }) {
    const service = inject<ObjectService<Record<string, unknown>>>("service");
    if (!service) {
      throw new Error("service is not defined");
    }
    const validate = inject<Ref<Record<string, string>>>("validate");
    if (!validate) {
      throw new Error("validate infomation is  not defined");
    }

    const invisible = inject<Ref<boolean>>("invisible");
    const { value, onChange } = useField(
      service.state as IReactiveState<Record<string, unknown>>,
      (record) => record[props.node.attrs.field as string],
      (record, value) => (record[props.node.attrs.field as string] = value)
    );
    const disabled = ref(false);
    useEffect(
      () => {
        disabled.value = service.isDisabled(props.node);
        if (invisible && props.node.attrs.invisible) {
          invisible.value = service.isInvisible(props.node);
        }
        if (props.node.attrs.value) {
          const _value =
            service.computed(props.node) ||
            service.state.raw[props.node.attrs.field as string];
          if (_value !== value.value) {
            onChange(_value);
          }
        }
      },
      [service.state],
      { immediate: true }
    );
    return () => {
      const { node } = props;
      const { component, displayName, field, required } = node.attrs as {
        field: string;
        component: string;
        displayName: string;
        required: string;
      };
      if (invisible && invisible.value) {
        return null;
      }
      const Component = useComponent<DefineComponent>(component);
      return (
        <div class={style["form-item"]}>
          <NFormItem
            label={displayName + ":"}
            labelWidth={100}
            labelPlacement="left"
            validationStatus={validate.value[field] ? "error" : undefined}
            feedback={validate.value[field]}
            required={required === "true"}
          >
            {Component &&
              h(Component, {
                value: value.value,
                onChange,
                disabled: disabled.value,
                node,
              })}
          </NFormItem>
        </div>
      );
    };
  },
});
