import { AppUserInfo } from "../../utils/types";

interface ADMIN {
  admin: AppUserInfo;
  type: string;
}

const adminRedux = (state = null, action: ADMIN) => {
  switch (action.type) {
    case "admin":
      return action.admin;
    case "logout":
      return null;
    default:
      return state;
  }
};

export default adminRedux;
