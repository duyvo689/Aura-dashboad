import { Role, User, Clinic, Service, Category, Payment } from "../../utils/types";
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
const clinicsAction = (type: any, clinics: Clinic[] | null) => {
  return {
    type,
    clinics,
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
const servicesAction = (type: any, services: Service[] | null) => {
  return {
    type,
    services,
  };
};

const categoryAction = (type: any, category: Category[] | null) => {
  return {
    type,
    category,
  };
};
const paymentAction = (type: any, payments: Payment[] | null) => {
  return {
    type,
    payments,
  };
};
export {
  bannersAction,
  adminAction,
  rolesAction,
  clinicsAction,
  servicesAction,
  categoryAction,
  paymentAction
};
