import { defineComponent, onMounted, ref } from "@vue/runtime-core";
import { NMenu } from "naive-ui";
import { useHistory } from "../../../hooks";
import style from "./index.module.scss";
const mock = [
  {
    key: "base-metadata",
    label: "元数据",
    children: [
      {
        label: "模型",
        key: "base.model",
      },
      {
        label: "字段",
        key: "base.field",
      },
      {
        label: "方法",
        key: "base.function",
      },
    ],
  },
  {
    key: "system-metadata",
    label: "业务元数据",
    children: [
      {
        label: "菜单",
        key: "system.menu",
      },
      {
        label: "视图",
        key: "system.view",
      },
    ],
  },
];
interface IMenuOption {
  key: string;
  label: string;
  children?: IMenuOption[];
}
export const Menu = defineComponent({
  setup() {
    const options = ref<IMenuOption[]>([]);
    const router = useHistory();
    onMounted(() => {
      options.value = mock;
    });
    const onSelected = (key: string) => {
      router.push({ param: { view: key } });
    };
    return () => {
      return (
        <NMenu
          class={style.menu}
          options={options.value}
          onUpdateValue={onSelected}
        />
      );
    };
  },
});
