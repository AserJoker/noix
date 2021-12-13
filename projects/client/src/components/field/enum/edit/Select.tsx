import { NSelect } from "naive-ui";
import { defineComponent, PropType } from "vue";
import { IViewNode } from "../../../../types";

export const Select = defineComponent({
  props: {
    node: {
      type: Object as PropType<IViewNode>,
      required: true,
    },
    value: {
      type: String,
    },
    onChange: {
      type: Function as PropType<(newValue: string) => void>,
    },
  },
  setup(props) {
    return () => {
      const { node, value, onChange } = props;
      const { children } = node;
      return (
        <NSelect
          clearable
          value={value}
          onUpdateValue={onChange}
          options={children.map((item) => {
            return {
              label: item.attrs.label as string,
              value: item.attrs.value as string,
            };
          })}
        />
      );
    };
  },
});
