import { Category } from "../../utils/types";
interface CATEGORY {
  category: Category[];
  type: string;
}

const adminRedux = (state = null, action: CATEGORY) => {
  switch (action.type) {
    case "category":
      return action.category;
    default:
      return state;
  }
};

export default adminRedux;
