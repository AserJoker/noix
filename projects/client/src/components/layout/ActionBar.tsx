import { defineComponent } from "@vue/runtime-core";
import { NSpace } from "naive-ui";
import { PropType } from "vue";
import { IViewNode } from "../../types";
import style from "./index.module.scss";

export const ActionBar = defineComponent({
  props: {
    node: {
      type: Object as PropType<IViewNode>,
      required: true,
    },
  },
  setup(_, { slots }) {
    return () => (
      <div class={style["action-bar"]}>
        <NSpace>{slots.default && slots.default()}</NSpace>
      </div>
    );
  },
});
