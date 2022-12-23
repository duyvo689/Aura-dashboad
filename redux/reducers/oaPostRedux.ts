import { OAPost } from "../../utils/types";
interface OAPostRedux {
  oaPost: OAPost[];
  type: string;
}

const oaPostRedux = (state = null, action: OAPostRedux) => {
  switch (action.type) {
    case "oaPosts":
      return action.oaPost;
    default:
      return state;
  }
};

export default oaPostRedux;
