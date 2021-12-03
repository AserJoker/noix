import { defineComponent } from "@vue/runtime-core";
import { NSpace } from "naive-ui";
import style from "./index.module.scss";

export const ActionBar = defineComponent({
  setup(_, { slots }) {
    return () => (
      <div class={style["action-bar"]}>
        <NSpace>{slots.default && slots.default()}</NSpace>
      </div>
    );
  },
});
