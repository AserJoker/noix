import { defineComponent, onUnmounted, ref } from "vue";
import { NSpin, useNotification } from "naive-ui";
import { Header } from "./block/Header";
import { Menu } from "./block/Menu";
import {
  useHistory,
  useRender,
  useRequest,
  useRouter,
  useView,
} from "../hooks";
import { resolveView } from "../helper/view";
import { IViewNode } from "../types";
import { useMessage } from "../hooks/cache/useMessage";
export const Application = defineComponent({
  props: {
    loading: {
      type: Boolean,
    },
  },
  setup(props, ctx) {
    const router = useRouter();
    const view = ref<IViewNode | null>(null);
    const viewCode = ref<string>("");
    const notification = useNotification();
    useRequest().use(async (req, param, next) => {
      try {
        const d = await next();
        return d;
      } catch (e) {
        const err = e as Error;
        notification.error({
          content: err.message,
          closable: false,
          duration: 2000,
        });
        console.error(err.stack);
      }
    });
    router.watch(
      () => {
        const _view = router.raw.param.view;
        if (!_view && view.value === null) {
          useHistory().push({
            param: { ...router.raw.param, view: "model.form" },
          });
        } else {
          useView(_view).then((data) => {
            if (data) {
              view.value = resolveView(data.xml);
              viewCode.value = _view;
            }
          });
        }
      },
      { immediate: true }
    );
    return () => {
      const { loading } = props;
      return (
        <NSpin show={loading}>
          <div class="fullscreen">
            <div class="layout-container layout-container-column">
              <div class="layout-item">
                <Header />
              </div>
              <div class="layout-item layout-item-fill layout-container layout-container-row">
                <Menu />
                <div class="layout-item layout-item-fill layout-item-fixed">
                  {view.value && useRender(view.value)}
                </div>
              </div>
            </div>
          </div>
        </NSpin>
      );
    };
  },
});
