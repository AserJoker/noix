import { defineComponent } from "@vue/runtime-core";
import { NRadio, NRadioGroup } from "naive-ui";
import { PropType } from "vue";
import { IViewNode } from "../../../../types";

export const Radio = defineComponent({
  props: {
    node: {
      type: Object as PropType<IViewNode>,
      required: true,
    },
    value: {
      type: Boolean,
      default: false,
    },
    onChange: {
      type: Function as PropType<(newValue: boolean) => void>,
    },
  },
  setup(props) {
    return () => {
      return (
        <NRadioGroup
          onUpdateValue={(val) => props.onChange && props.onChange(!!val)}
          value={props.value ? 1 : 0}
        >
          <NRadio value={1}>是</NRadio>
          <NRadio value={0}>否</NRadio>
        </NRadioGroup>
      );
    };
  },
});
