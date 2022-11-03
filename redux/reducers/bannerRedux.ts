import { Banner } from "../../utils/types";
interface BANNER {
  banners: Banner[];
  type: string;
}

const adminRedux = (state = null, action: BANNER) => {
  switch (action.type) {
    case "banners":
      return action.banners;
    default:
      return state;
  }
};

export default adminRedux;
