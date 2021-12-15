import { defineComponent, onUnmounted, ref } from "vue";
import { NSpin, useDialog, useNotification } from "naive-ui";
import { Header } from "./block/Header";
import { Menu } from "./block/Menu";
import { useHistory, useRequest, useRouter, useView } from "../hooks";
import { resolveView } from "../helper/view";
import { IViewNode } from "../types";
import { useMessage } from "../hooks/cache/useMessage";
import { View } from "./view";
export const Application = defineComponent({
  props: {
    loading: {
      type: Boolean,
    },
  },
  setup(props, ctx) {
    const router = useRouter();
    const view = ref<string>("");
    const viewParam = ref<Record<string, unknown>>({});
    const viewCode = ref<string>("");
    const notification = useNotification();
    const dialog = useDialog();
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
        viewParam.value = router.value.param;
        if (!_view && view.value === null) {
          useHistory().push({
            param: { ...router.raw.param, view: "model.form" },
          });
        } else {
          view.value = _view;
        }
      },
      { immediate: true }
    );
    const notificationOff = useMessage().on("notification", (msg) => {
      const content = msg.param.content;
      const n = notification.create({
        ...msg.param,
        content:
          typeof content === "function" ? content(() => n.destroy()) : content,
      });
    });
    const dialogOff = useMessage().on("dialog", (msg) => {
      const content = msg.param.content;
      const d = dialog.create({
        ...msg.param,
        content: () => {
          if (typeof content === "function") {
            return content(() => d.destroy());
          }
          return content;
        },
      });
    });
    onUnmounted(() => {
      notificationOff();
      dialogOff();
    });
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
                  <View view={view.value} param={viewParam.value} />
                </div>
              </div>
            </div>
          </div>
        </NSpin>
      );
    };
  },
});
