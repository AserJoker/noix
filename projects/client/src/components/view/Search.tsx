import { NButton, NSpace } from "naive-ui";
import { defineComponent, PropType, provide, inject } from "vue";
import { useRef } from "../../hooks";
import { ListService, ObjectService } from "../../service";
import { IViewNode } from "../../types";
import style from "./index.module.scss";

export const Search = defineComponent({
  props: {
    node: {
      type: Object as PropType<IViewNode>,
      required: true,
    },
  },
  setup(props, ctx) {
    const service = inject<ListService<Record<string, unknown>>>("service");
    if (!service) {
      throw new Error("service not defined");
    }
    const searchSearvice = new ObjectService(service.search, props.node);
    const validate = useRef(searchSearvice.validateInfo);
    provide("service", searchSearvice);
    provide("validate", validate);
    const onSearch = () => {
      service.load();
    };
    const onReset = () => {
      service.reset();
    };
    return () => {
      return (
        <div class={style["search"]}>
          <div class={style['search-form']}>{ctx.slots.default && ctx.slots.default()}</div>
          <div class={style["search-action-bar"]}>
            <NSpace>
              <NButton type="primary"  onClick={onSearch}>
                查询
              </NButton>
              <NButton onClick={onReset}>
                重置
              </NButton>
            </NSpace>
          </div>
        </div>
      );
    };
  },
});
