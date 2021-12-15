import { View } from "../../components";
import { useMessage } from "../../hooks/cache/useMessage";
export const dialog = (param: Record<string, unknown>) => {
  const { view } = param;
  useMessage().postMessage("dialog", {
    content: (close: () => void) => {
      return <View view={view as string} param={param} />;
    },
    style: {
      width: "800px",
    },
  });
};
