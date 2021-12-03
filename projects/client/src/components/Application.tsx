import { defineComponent, onMounted, ref } from "vue";
import { NConfigProvider, NSpin } from "naive-ui";
import { Header } from "./block/Header";
import { Menu } from "./block/Menu";
import { useRef, useRender, useRouter } from "../hooks";
import { resolveView } from "../helper/view";
import { IViewNode } from "../types";
const viewXML = `
<form model="base.model">
    <col-container>
        <action-bar>
            <action name="back" displayName="返回"/>
            <action name="router" displayName="前往">
              <param value="\${current.code}"/>
            </action>
        </action-bar>
        <row-container cols="12">
            <row-item span="3">
                <form-item name="code" component="string-input"/>
            </row-item>
            <row-item span="3">
                <form-item name="name" component="string-input"/>
            </row-item>
            <row-item span="3">
                <form-item name="namespace" component="string-input"/>
            </row-item>
            <row-item span="3">
                <form-item name="key" component="string-input"/>
            </row-item>
            <row-item span="3">
                <form-item name="store" component="boolean-radio"/>
            </row-item>
            <row-item span="3">
                <form-item name="virtual" component="boolean-radio"/>
            </row-item>
        </row-container>
    </col-container>
</form>`;
export const Application = defineComponent({
  props: {
    loading: {
      type: Boolean,
    },
  },
  setup(props, ctx) {
    const router = useRouter();
    const routerRef = useRef(router);
    const view = ref<IViewNode | null>(null);
    onMounted(() => {
      view.value = resolveView(viewXML);
    });
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
                  <div class="layout-item layout-item-fill">
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
