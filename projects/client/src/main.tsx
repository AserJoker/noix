import { createApp } from "vue";
import { initBundles } from "./bundle";
import { Application } from "./components";
import { useContext, usePromise } from "./hooks";
import {
  NConfigProvider,
  NDialogProvider,
  NNotificationProvider,
} from "naive-ui";
import "./global.scss";
import "./style/layout.scss";
const app = createApp({
  setup() {
    const { loading } = usePromise(initBundles());
    const context = useContext();
    const config = {
      baseURL: import.meta.env.VITE_BASE_URL,
    };
    context.setRaw({
      config,
    });
    return () => {
      return (
        <NNotificationProvider>
          <NDialogProvider>
            <NConfigProvider abstract>
              <Application
                loading={loading.value}
                style={{ minWidth: "1200px" }}
              />
            </NConfigProvider>
          </NDialogProvider>
        </NNotificationProvider>
      );
    };
  },
});
app.mount("#app");
