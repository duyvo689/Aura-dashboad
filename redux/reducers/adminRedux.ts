// import { Admin } from "../../types/types";

interface ADMIN {
  admin: any;
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
