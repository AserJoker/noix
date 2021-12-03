import { createApp } from "vue";
import { initBundles } from "./bundle";
import { Application } from "./components";
import { usePromise } from "./hooks";
import "./global.scss";
import "./style/layout.scss";
const app = createApp({
  setup() {
    const { loading } = usePromise(initBundles());
    return () => {
      return <Application loading={loading.value} />;
    };
  },
});
app.mount("#app");
