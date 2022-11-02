import { Role } from "../../utils/types";
const rolesAction = (type: any, roles: Role[] | null) => {
  return {
    type,
    roles,
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
