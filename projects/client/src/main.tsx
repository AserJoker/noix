import { createApp } from "vue";
import { initBundles } from "./bundle";
import { Application } from "./components";
import { useContext, usePromise } from "./hooks";
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
      return <Application loading={loading.value} />;
    };
  },
});
app.mount("#app");
