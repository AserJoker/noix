import { defineComponent } from "@vue/runtime-core";
import style from "./index.module.scss";
export const Header = defineComponent({
  setup() {
    return () => {
      return <div class={style.header}>header</div>;
    };
  },
});
