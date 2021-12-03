import { useHistory } from "../../hooks";

export const back = () => {
  const router = useHistory();
  router.back();
};
