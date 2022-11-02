import { Role, User } from "../../utils/types";
const rolesAction = (type: any, roles: Role[] | null) => {
  return {
    type,
    roles,
  };
};
const usersAction = (type: any, users: User[] | null) => {
  return {
    type,
    users,
  };
};
const bannersAction = (type: any, banners: any[] | null) => {
  return {
    type,
    banners,
  };
};
const adminAction = (type: any, admin: any | null) => {
  return {
    type,
    admin,
  };
};

export { bannersAction, adminAction, rolesAction };
