import useUserStore from "./modules/user";
import useRouterStore from "./modules/permission";

export default function store() {
  return {
    router: useRouterStore(),
    user: useUserStore(),
  };
}