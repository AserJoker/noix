import { defineComponent, ref } from "vue";
import { NConfigProvider, NSpin } from "naive-ui";
import { Header } from "./block/Header";
import { Menu } from "./block/Menu";
import { useHistory, useRender, useRouter, useView } from "../hooks";
import { resolveView } from "../helper/view";
import { IViewNode } from "../types";
export const Application = defineComponent({
  props: {
    loading: {
      type: Boolean,
    },
  },
  setup(props, ctx) {
    const router = useRouter();
    const view = ref<IViewNode | null>(null);
    router.watch(
      () => {
        const _view = router.raw.param.view;
        if (!_view) {
          useHistory().push({
            param: { ...router.raw.param, view: "model.form" },
          });
        } else {
          useView(_view)
            .then((data) => {
              if (data) {
                view.value = resolveView(data.xml);
              }
            })
            .catch((e) => {
              alert(e.message);
            });
        }
      },
      { immediate: true }
    );
    return () => {
      const { loading } = props;
      return (
        <NConfigProvider abstract>
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
        </NConfigProvider>
      );
    };
  },
});
